import { useMemo } from 'react'
import * as THREE from 'three'
import { YARD_TO_METER } from '../constants'

interface Route {
  startX: number
  startZ: number
  endX: number
  endZ: number
  controlPoints?: { x: number; z: number }[]
  type: 'straight' | 'curl' | 'post' | 'slant' | 'out' | 'corner' | 'fade'
}

export default function Playbook() {
  const routes: Route[] = [
    // WR routes
    { startX: -7, startZ: 8, endX: 5, endZ: 12, type: 'out' }, // Hill - out route
    { startX: -7, startZ: -8, endX: 3, endZ: -6, type: 'slant' }, // Hardman - slant
    { 
      startX: -7, 
      startZ: 6, 
      endX: 8, 
      endZ: 0, 
      type: 'post',
      controlPoints: [
        { x: -2, z: 6 },  // Run straight first
        { x: 2, z: 6 },   // Continue straight
        { x: 5, z: 3 }    // Then cut to post
      ]
    }, // Valdes - post route
    
    // Receiver backwards arc (reverse/jet sweep motion)
    {
      startX: -7,
      startZ: -8,
      endX: -10,
      endZ: 2,
      type: 'curl',
      controlPoints: [
        { x: -8, z: -6 },   // Start moving back
        { x: -9, z: -3 },   // Arc behind QB
        { x: -10, z: 0 }    // Continue arc
      ]
    }, // Hardman - jet sweep motion
    
    // TE route - drag
    { 
      startX: -7, 
      startZ: 2, 
      endX: 0, 
      endZ: 5, 
      type: 'curl',
      controlPoints: [
        { x: -4, z: 2 },
        { x: -2, z: 3 },
        { x: -1, z: 4 }
      ]
    }, // Kelce - drag route
    
    // RB route - checkdown
    { 
      startX: -8, 
      startZ: -1, 
      endX: -3, 
      endZ: 3, 
      type: 'curl',
      controlPoints: [
        { x: -7, z: 0 },
        { x: -5, z: 1.5 }
      ]
    }, // Hunt - checkdown
    
    // Offensive Line Blocking Routes
    { startX: -7, startZ: -2, endX: -3, endZ: -3, type: 'straight' }, // Brown (LT) - pulls/blocks
    { startX: -7, startZ: 1, endX: -3, endZ: 2, type: 'straight' }, // Thuney (RG) - pulls/blocks
    
    // QB dropback
    { startX: -5, startZ: 0, endX: -12, endZ: 0, type: 'straight' }, // Mahomes - dropback
    
    // Defense routes (coverage)
    { startX: -2, startZ: 8, endX: 5, endZ: 12, type: 'straight' }, // Ramsey covering Hill
    { startX: -2, startZ: -8, endX: 3, endZ: -6, type: 'straight' }, // Williams covering Hardman
    { startX: 5, startZ: 0, endX: 8, endZ: 0, type: 'straight' }, // Jackson - deep safety
    { startX: 0, startZ: 6, endX: 0, endZ: 12, type: 'straight' }, // Scott - zone coverage
  ]

  const createRoute = (route: Route, index: number) => {
    // Positions slightly above field to ensure visibility over all field markings
    const Y_HEIGHT = 0.1  // Raised to be above field layers
    const startPos = new THREE.Vector3(route.startX * YARD_TO_METER, Y_HEIGHT, route.startZ * YARD_TO_METER)
    const endPos = new THREE.Vector3(route.endX * YARD_TO_METER, Y_HEIGHT, route.endZ * YARD_TO_METER)
    
    let points: THREE.Vector3[] = []
    
    if (route.type === 'straight') {
      points = [startPos, endPos]
    } else if (route.controlPoints) {
      // Create smooth curve through control points
      const curvePoints = [
        startPos,
        ...route.controlPoints.map(cp => 
          new THREE.Vector3(cp.x * YARD_TO_METER, Y_HEIGHT, cp.z * YARD_TO_METER)
        ),
        endPos
      ]
      
      // Use CatmullRomCurve3 for smooth curves
      const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5)
      points = curve.getPoints(50)
    } else {
      // Default to straight if no control points
      points = [startPos, endPos]
    }
    
    return (
      <mesh key={`route-${index}`}>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3(points),
          64,  // tube segments
          0.05,  // tube radius (subtle 3D thickness)
          8,  // radial segments
          false  // closed
        ]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
    )
  }

  return (
    <group>
      {routes.map((route, index) => createRoute(route, index))}
    </group>
  )
}