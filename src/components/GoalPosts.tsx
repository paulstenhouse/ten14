import {
  FIELD_LENGTH,
  YARD_TO_METER,
  FOOT_TO_METER,
  INCH_TO_METER,
  RESTRICTION_YELLOW,
  CONCRETE_GRAY,
  END_ZONE_DEPTH,
} from '../constants'

export default function GoalPosts() {
  const goalPosts = []
  
  // NFL Goal Post Dimensions (exact specifications)
  const postDiameter = 4 * INCH_TO_METER // 4 inch diameter posts
  const postRadius = postDiameter / 2
  const crossbarHeight = 10 * FOOT_TO_METER // 10 feet
  const uprightHeight = 35 * FOOT_TO_METER // 35 feet above crossbar
  const totalHeight = crossbarHeight + uprightHeight // Total height from ground
  const uprightSpacing = 18.5 * FOOT_TO_METER // 18 feet 6 inches apart (inside width)
  const goalPostDepth = 6.5 * FOOT_TO_METER // 6'6" depth
  
  // Padding dimensions
  const paddingHeight = 6 * FOOT_TO_METER // 6 feet of padding
  const paddingThickness = 0.15 // About 6 inches thick padding
  
  // Flag dimensions
  const flagLength = 42 * INCH_TO_METER // 42 inches
  const flagWidth = 4 * INCH_TO_METER // 4 inches

  // Goal post positions (centered above outside edge of end zones)
  const goalLinePosition = ((FIELD_LENGTH - 2 * END_ZONE_DEPTH) * YARD_TO_METER) / 2
  const goalPostPositions = [
    goalLinePosition + END_ZONE_DEPTH * YARD_TO_METER, // Back of end zone
    -goalLinePosition - END_ZONE_DEPTH * YARD_TO_METER,
  ]

  goalPostPositions.forEach((xPos, index) => {
    const isLeftSide = index === 0
    const direction = isLeftSide ? 1 : -1
    
    // Main support post (single post design) - positioned at goal post depth behind end line
    const supportX = xPos - (direction * goalPostDepth)
    
    // Support post goes from ground to near crossbar height
    const supportPostHeight = 8 * FOOT_TO_METER // 8 feet tall support post
    
    // Support post with thicker base
    goalPosts.push(
      <mesh key={`support-main-${index}`} position={[supportX, supportPostHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[postRadius * 1.5, postRadius * 2, supportPostHeight]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} />
      </mesh>
    )
    
    // High impact padding around lower section of support post
    goalPosts.push(
      <mesh key={`support-padding-${index}`} position={[supportX, paddingHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[postRadius * 1.5 + paddingThickness, postRadius * 2 + paddingThickness, paddingHeight]} />
        <meshBasicMaterial color="#FFD700" opacity={0.9} />
      </mesh>
    )
    
    // Gooseneck - more realistic curved section
    const gooseneckSegments = 16
    const curveRadius = 3 * FOOT_TO_METER
    
    // Vertical section of gooseneck (if needed)
    const verticalHeight = crossbarHeight - supportPostHeight - curveRadius
    if (verticalHeight > 0) {
      goalPosts.push(
        <mesh 
          key={`gooseneck-vertical-${index}`} 
          position={[supportX, supportPostHeight + verticalHeight / 2, 0]} 
          castShadow
        >
          <cylinderGeometry args={[postRadius, postRadius, verticalHeight]} />
          <meshBasicMaterial color={RESTRICTION_YELLOW} />
        </mesh>
      )
    }
    
    // Curved section of gooseneck
    const curveStartY = Math.max(supportPostHeight, crossbarHeight - curveRadius)
    
    for (let i = 0; i <= gooseneckSegments; i++) {
      const t = i / gooseneckSegments
      const angle = (t * Math.PI) / 2
      
      // Start from top of support post and curve to crossbar height
      const segmentX = supportX + direction * Math.sin(angle) * curveRadius
      const segmentY = curveStartY + (1 - Math.cos(angle)) * curveRadius
      
      if (i < gooseneckSegments) {
        const nextT = (i + 1) / gooseneckSegments
        const nextAngle = (nextT * Math.PI) / 2
        const nextX = supportX + direction * Math.sin(nextAngle) * curveRadius
        const nextY = curveStartY + (1 - Math.cos(nextAngle)) * curveRadius
        
        const length = Math.sqrt(Math.pow(nextX - segmentX, 2) + Math.pow(nextY - segmentY, 2))
        const midX = (segmentX + nextX) / 2
        const midY = (segmentY + nextY) / 2
        const rotation = Math.atan2(nextY - segmentY, direction * (nextX - segmentX))
        
        goalPosts.push(
          <mesh
            key={`gooseneck-curve-${index}-${i}`}
            position={[midX, midY, 0]}
            rotation={[0, 0, rotation - Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[postRadius, postRadius, length]} />
            <meshBasicMaterial color={RESTRICTION_YELLOW} />
          </mesh>
        )
      }
    }
    
    // Horizontal section to crossbar
    const horizontalLength = goalPostDepth - curveRadius
    goalPosts.push(
      <mesh
        key={`gooseneck-horizontal-${index}`}
        position={[supportX + direction * (curveRadius + horizontalLength / 2), crossbarHeight, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[postRadius, postRadius, horizontalLength]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} />
      </mesh>
    )

    // Crossbar (horizontal bar connecting the uprights)
    goalPosts.push(
      <mesh key={`crossbar-${index}`} position={[xPos, crossbarHeight, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[postRadius, postRadius, uprightSpacing + postRadius * 2]} />
        <meshBasicMaterial color={RESTRICTION_YELLOW} />
      </mesh>
    )

    // Uprights extending from crossbar
    const uprightPositions = [-uprightSpacing / 2, uprightSpacing / 2]
    uprightPositions.forEach((zPos, uprightIndex) => {
      // Main upright - starts from crossbar and goes up
      goalPosts.push(
        <mesh
          key={`upright-${index}-${uprightIndex}`}
          position={[xPos, crossbarHeight + uprightHeight / 2, zPos]}
          castShadow
        >
          <cylinderGeometry args={[postRadius, postRadius * 0.9, uprightHeight]} />
          <meshBasicMaterial color={RESTRICTION_YELLOW} />
        </mesh>
      )
      
      // Lower section from ground to crossbar for structural support
      goalPosts.push(
        <mesh
          key={`upright-lower-${index}-${uprightIndex}`}
          position={[xPos, crossbarHeight / 2, zPos]}
          castShadow
        >
          <cylinderGeometry args={[postRadius * 1.1, postRadius, crossbarHeight]} />
          <meshBasicMaterial color={RESTRICTION_YELLOW} />
        </mesh>
      )
      
      // Orange wind flag at top
      goalPosts.push(
        <mesh
          key={`flag-${index}-${uprightIndex}`}
          position={[xPos + direction * 0.2, crossbarHeight + uprightHeight - flagLength / 2, zPos]}
          rotation={[0, direction * Math.PI / 4, 0]}
        >
          <planeGeometry args={[flagWidth, flagLength]} />
          <meshBasicMaterial color="#FF6600" side={2} transparent opacity={0.9} />
        </mesh>
      )
    })

    // Connection joints where uprights meet crossbar
    uprightPositions.forEach((zPos, capIndex) => {
      goalPosts.push(
        <mesh key={`joint-${index}-${capIndex}`} position={[xPos, crossbarHeight, zPos]} castShadow>
          <sphereGeometry args={[postRadius * 1.2]} />
          <meshBasicMaterial color={RESTRICTION_YELLOW} />
        </mesh>
      )
    })

    // Base foundation (more realistic concrete base)
    goalPosts.push(
      <mesh key={`base-foundation-${index}`} position={[supportX, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 2, 0.2]} />
        <meshBasicMaterial color={CONCRETE_GRAY} />
      </mesh>
    )
    
    // Safety mat around base
    goalPosts.push(
      <mesh key={`safety-mat-${index}`} position={[supportX, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3, 0.02]} />
        <meshBasicMaterial color="#2F4F2F" />
      </mesh>
    )
  })

  return <>{goalPosts}</>
}