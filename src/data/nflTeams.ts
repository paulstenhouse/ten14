export interface NFLTeam {
  name: string
  city: string
  abbreviation: string
  primaryColor: string
  secondaryColor: string
}

export const NFL_TEAMS: NFLTeam[] = [
  { name: "Cardinals", city: "Arizona", abbreviation: "ARI", primaryColor: "#97233F", secondaryColor: "#000000" },
  { name: "Falcons", city: "Atlanta", abbreviation: "ATL", primaryColor: "#A71930", secondaryColor: "#000000" },
  { name: "Ravens", city: "Baltimore", abbreviation: "BAL", primaryColor: "#241773", secondaryColor: "#9E7C0C" },
  { name: "Bills", city: "Buffalo", abbreviation: "BUF", primaryColor: "#00338D", secondaryColor: "#C60C30" },
  { name: "Panthers", city: "Carolina", abbreviation: "CAR", primaryColor: "#0085CA", secondaryColor: "#101820" },
  { name: "Bears", city: "Chicago", abbreviation: "CHI", primaryColor: "#0B162A", secondaryColor: "#C83803" },
  { name: "Bengals", city: "Cincinnati", abbreviation: "CIN", primaryColor: "#FB4F14", secondaryColor: "#000000" },
  { name: "Browns", city: "Cleveland", abbreviation: "CLE", primaryColor: "#311D00", secondaryColor: "#FF3C00" },
  { name: "Cowboys", city: "Dallas", abbreviation: "DAL", primaryColor: "#003594", secondaryColor: "#869397" },
  { name: "Broncos", city: "Denver", abbreviation: "DEN", primaryColor: "#FB4F14", secondaryColor: "#002244" },
  { name: "Lions", city: "Detroit", abbreviation: "DET", primaryColor: "#0076B6", secondaryColor: "#B0B7BC" },
  { name: "Packers", city: "Green Bay", abbreviation: "GB", primaryColor: "#203731", secondaryColor: "#FFB612" },
  { name: "Texans", city: "Houston", abbreviation: "HOU", primaryColor: "#03202F", secondaryColor: "#A71930" },
  { name: "Colts", city: "Indianapolis", abbreviation: "IND", primaryColor: "#002C5F", secondaryColor: "#A2AAAD" },
  { name: "Jaguars", city: "Jacksonville", abbreviation: "JAX", primaryColor: "#101820", secondaryColor: "#D7A22A" },
  { name: "Chiefs", city: "Kansas City", abbreviation: "KC", primaryColor: "#E31837", secondaryColor: "#FFB81C" },
  { name: "Chargers", city: "Los Angeles", abbreviation: "LAC", primaryColor: "#0080C6", secondaryColor: "#FFC20E" },
  { name: "Rams", city: "Los Angeles", abbreviation: "LAR", primaryColor: "#003594", secondaryColor: "#FFA300" },
  { name: "Raiders", city: "Las Vegas", abbreviation: "LV", primaryColor: "#000000", secondaryColor: "#A5ACAF" },
  { name: "Dolphins", city: "Miami", abbreviation: "MIA", primaryColor: "#008E97", secondaryColor: "#FC4C02" },
  { name: "Vikings", city: "Minnesota", abbreviation: "MIN", primaryColor: "#4F2683", secondaryColor: "#FFC62F" },
  { name: "Patriots", city: "New England", abbreviation: "NE", primaryColor: "#002244", secondaryColor: "#C60C30" },
  { name: "Saints", city: "New Orleans", abbreviation: "NO", primaryColor: "#D3BC8D", secondaryColor: "#101820" },
  { name: "Giants", city: "New York", abbreviation: "NYG", primaryColor: "#0B2265", secondaryColor: "#A71930" },
  { name: "Jets", city: "New York", abbreviation: "NYJ", primaryColor: "#125740", secondaryColor: "#000000" },
  { name: "Eagles", city: "Philadelphia", abbreviation: "PHI", primaryColor: "#004C54", secondaryColor: "#A5ACAF" },
  { name: "Steelers", city: "Pittsburgh", abbreviation: "PIT", primaryColor: "#FFB612", secondaryColor: "#101820" },
  { name: "49ers", city: "San Francisco", abbreviation: "SF", primaryColor: "#AA0000", secondaryColor: "#B3995D" },
  { name: "Seahawks", city: "Seattle", abbreviation: "SEA", primaryColor: "#002244", secondaryColor: "#69BE28" },
  { name: "Buccaneers", city: "Tampa Bay", abbreviation: "TB", primaryColor: "#D50A0A", secondaryColor: "#34302B" },
  { name: "Titans", city: "Tennessee", abbreviation: "TEN", primaryColor: "#0C2340", secondaryColor: "#4B92DB" },
  { name: "Commanders", city: "Washington", abbreviation: "WAS", primaryColor: "#5A1414", secondaryColor: "#FFB612" }
]