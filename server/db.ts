import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define TS Interfaces for DB Schema
export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
}

export interface PredictorData {
  exam: string;
  minRank: number;
  maxRank: number;
}

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number; // Average annual tuition fees
  rating: number;
  establishedYear: number;
  description: string;
  image: string;
  placementPercentage: number;
  averagePackage: number; // in LPA (Lakhs Per Annum)
  courses: Course[];
  reviews: Review[];
  predictorData: PredictorData[];
  type?: 'Government' | 'Private' | 'Autonomous';
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  savedAt: string;
}

export interface SavedComparison {
  id: string;
  userId: string;
  collegeIds: string[];
  savedAt: string;
}

interface DatabaseSchema {
  users: User[];
  colleges: College[];
  savedColleges: SavedCollege[];
  savedComparisons: SavedComparison[];
}

const DB_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to write database
function saveDatabase(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}



// Generate Mock Colleges Seeds
const INITIAL_COLLEGES: College[] = [
  {
    id: "col-iit-b",
    name: "Indian Institute of Technology, Bombay (IITB)",
    location: "Mumbai, Maharashtra",
    state: "Maharashtra",
    fees: 220000,
    rating: 4.9,
    establishedYear: 1958,
    description: "IIT Bombay is a global summit of technical education, research, and innovation. Located in Powai along the scenic lake, it boasts a powerful academic curriculum, thriving startup incubation ecosystems, and prestigious placement drives.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 97.4,
    averagePackage: 25.8,
    courses: [
      { id: "c-1", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 220000 },
      { id: "c-2", name: "B.Tech Electrical Engineering", duration: "4 Years", fees: 215000 },
      { id: "c-3", name: "B.Tech Mechanical Engineering", duration: "4 Years", fees: 210000 },
      { id: "c-4", name: "B.Tech Aerospace Engineering", duration: "4 Years", fees: 210000 },
      { id: "c-5", name: "M.Tech Data Science", duration: "2 Years", fees: 120000 }
    ],
    reviews: [
      { id: "r-1", userName: "Aditya Sharma", rating: 5, comment: "Incredible infrastructure and peer group. The coding culture is unparalleled and the tech fests are unforgettable." },
      { id: "r-2", userName: "Neha Patel", rating: 4.8, comment: "Extremely challenging syllabus but pays off incredibly during the placement season." }
    ],
    predictorData: [
      { exam: "JEE Advanced", minRank: 1, maxRank: 65 },
      { exam: "GATE", minRank: 1, maxRank: 100 }
    ]
  },
  {
    id: "col-iit-d",
    name: "Indian Institute of Technology, Delhi (IITD)",
    location: "New Delhi, Delhi",
    state: "Delhi",
    fees: 225000,
    rating: 4.8,
    establishedYear: 1961,
    description: "IIT Delhi, located in South Delhi's serene Hauz Khas region, is internationally acclaimed for its research caliber, state-of-the-art supercomputing labs, and deep tie-ups with leading technology conglomerates.",
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 96.2,
    averagePackage: 24.5,
    courses: [
      { id: "c-6", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 225000 },
      { id: "c-7", name: "B.Tech Mathematics & Computing", duration: "4 Years", fees: 225000 },
      { id: "c-8", name: "B.Tech Civil Engineering", duration: "4 Years", fees: 215000 },
      { id: "c-9", name: "M.Tech Artificial Intelligence", duration: "2 Years", fees: 130000 }
    ],
    reviews: [
      { id: "r-3", userName: "Samir Sen", rating: 5, comment: "Fabulous campus, global exposure, and alumni network that opens doors at every top tech startup worldwide." }
    ],
    predictorData: [
      { exam: "JEE Advanced", minRank: 10, maxRank: 115 },
      { exam: "GATE", minRank: 5, maxRank: 150 }
    ]
  },
  {
    id: "col-iit-m",
    name: "Indian Institute of Technology, Madras (IITM)",
    location: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    fees: 210000,
    rating: 4.9,
    establishedYear: 1959,
    description: "Ranked #1 consistently by NIRF, IIT Madras stands tall for its massive green campus in Chennai, its specialized Research Park, and exceptional research output in clean energy, marine structures, and quantum systems.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 98.1,
    averagePackage: 26.2,
    courses: [
      { id: "c-10", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 210000 },
      { id: "c-11", name: "B.Tech Engineering Physics", duration: "4 Years", fees: 210000 },
      { id: "c-12", name: "B.Tech Chemical Engineering", duration: "4 Years", fees: 205000 },
      { id: "c-13", name: "Dual Degree Data Science", duration: "5 Years", fees: 210000 }
    ],
    reviews: [
      { id: "r-4", userName: "Rohan Iyer", rating: 5, comment: "NIRF Rank 1 for a solid reason! The campus is literally a forest filled with deer, and professors have outstanding industry linkages." }
    ],
    predictorData: [
      { exam: "JEE Advanced", minRank: 5, maxRank: 150 }
    ]
  },
  {
    id: "col-iit-kgp",
    name: "Indian Institute of Technology, Kharagpur (IITKGP)",
    location: "Kharagpur, West Bengal",
    state: "West Bengal",
    fees: 215000,
    rating: 4.7,
    establishedYear: 1951,
    description: "The absolute oldest and largest of the IITs, Kharagpur is famed for its monumental 2100-acre campus, its prestigious 'Spring Fest' and 'Kshitij' symposiums, and its diverse degree options spanning Engineering, Law, and Architecture.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 94.8,
    averagePackage: 22.1,
    courses: [
      { id: "c-14", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 215000 },
      { id: "c-15", name: "B.Tech Electronics & EC Engineering", duration: "4 Years", fees: 215000 },
      { id: "c-16", name: "B.Arch Architecture", duration: "5 Years", fees: 210000 }
    ],
    reviews: [
      { id: "r-5", userName: "Aranya Ray", rating: 4.6, comment: "Kharagpur feels like a self-sufficient township. Outstanding culture of collaboration and incredible coding platforms." }
    ],
    predictorData: [
      { exam: "JEE Advanced", minRank: 100, maxRank: 300 }
    ]
  },
  {
    id: "col-iit-k",
    name: "Indian Institute of Technology, Kanpur (IITK)",
    location: "Kanpur, Uttar Pradesh",
    state: "Uttar Pradesh",
    fees: 218000,
    rating: 4.8,
    establishedYear: 1959,
    description: "IIT Kanpur is globally celebrated for its intense academic rigor, one of India's preeminent computing facilities, and an impressive airstrip for aeronautical exploration.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 95.5,
    averagePackage: 23.4,
    courses: [
      { id: "c-17", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 218000 },
      { id: "c-18", name: "B.Tech Materials Science", duration: "4 Years", fees: 210000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Advanced", minRank: 50, maxRank: 220 }
    ]
  },
  {
    id: "col-iit-r",
    name: "Indian Institute of Technology, Roorkee (IITR)",
    location: "Roorkee, Uttarakhand",
    state: "Uttarakhand",
    fees: 222000,
    rating: 4.7,
    establishedYear: 1847,
    description: "Formerly the Thomason College of Civil Engineering established in 1847, IIT Roorkee holds the prestige of being Asia's oldest technical institute, delivering brilliant programs nestled near the scenic Himalayas.",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 93.9,
    averagePackage: 21.0,
    courses: [
      { id: "c-19", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 222000 },
      { id: "c-20", name: "B.Tech Civil Engineering", duration: "4 Years", fees: 210000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Advanced", minRank: 200, maxRank: 420 }
    ]
  },
  {
    id: "col-iit-g",
    name: "Indian Institute of Technology, Guwahati (IITG)",
    location: "Guwahati, Assam",
    state: "Assam",
    fees: 210000,
    rating: 4.6,
    establishedYear: 1994,
    description: "Spanned beautifully along the banks of the mighty Brahmaputra river, IIT Guwahati is visually mesmerizing and scientifically stellar, leading cutting-edge research in biotech, nano-tech and green systems.",
    image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 92.5,
    averagePackage: 19.8,
    courses: [
      { id: "c-21", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 210000 },
      { id: "c-22", name: "B.Tech Biotechnology", duration: "4 Years", fees: 200000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Advanced", minRank: 300, maxRank: 600 }
    ]
  },
  {
    id: "col-iit-h",
    name: "Indian Institute of Technology, Hyderabad (IITH)",
    location: "Hyderabad, Telangana",
    state: "Telangana",
    fees: 230000,
    rating: 4.7,
    establishedYear: 2008,
    description: "Recognized as one of the premier second-generation IITs, IIT Hyderabad is notable for its architectural marvel campus, pioneering joint ventures with Japan, and specialized streams in AI and quantum math.",
    image: "https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 94.1,
    averagePackage: 21.6,
    courses: [
      { id: "c-23", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 230000 },
      { id: "c-24", name: "B.Tech Smart Systems", duration: "4 Years", fees: 230000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Advanced", minRank: 400, maxRank: 680 }
    ]
  },
  // NITs
  {
    id: "col-nit-trichy",
    name: "National Institute of Technology, Tiruchirappalli (NITT)",
    location: "Tiruchirappalli, Tamil Nadu",
    state: "Tamil Nadu",
    fees: 145000,
    rating: 4.6,
    establishedYear: 1964,
    description: "NIT Trichy is the undisputed crown of the NIT group, delivering world-class engineering education and securing top rankings that challenge the elite IITs, situated in the heritage temple town of Trichy.",
    image: "https://images.unsplash.com/photo-1607237138185-eedd996259f9?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 95.8,
    averagePackage: 18.2,
    courses: [
      { id: "c-25", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 145000 },
      { id: "c-26", name: "B.Tech Electronics & Comm", duration: "4 Years", fees: 140000 },
      { id: "c-27", name: "B.Tech Metallurgical Engineering", duration: "4 Years", fees: 135000 }
    ],
    reviews: [
      { id: "r-6", userName: "Vijay Krish", rating: 4.9, comment: "Amazing placement track record. The global brand value is immense and fees are very low compared to private colleges." }
    ],
    predictorData: [
      { exam: "JEE Main", minRank: 500, maxRank: 1800 }
    ]
  },
  {
    id: "col-nit-k",
    name: "National Institute of Technology, Surathkal (NITK)",
    location: "Surathkal, Karnataka",
    state: "Karnataka",
    fees: 150000,
    rating: 4.5,
    establishedYear: 1960,
    description: "NITK Surathkal boasts its very own private beach, coupled with exceptional computer labs and high-quality alumni steering major tech circles.",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 94.2,
    averagePackage: 17.9,
    courses: [
      { id: "c-28", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 150000 },
      { id: "c-29", name: "B.Tech Information Technology", duration: "4 Years", fees: 148000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 600, maxRank: 2200 }
    ]
  },
  {
    id: "col-nit-rkl",
    name: "National Institute of Technology, Rourkela (NITRKL)",
    location: "Rourkela, Odisha",
    state: "Odisha",
    fees: 140000,
    rating: 4.4,
    establishedYear: 1961,
    description: "NIT Rourkela boasts a highly-rated campus housing spectacular science blocks, active cultural circles, and consistent ranking in NIRF top 20.",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 91.5,
    averagePackage: 15.1,
    courses: [
      { id: "c-30", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 140000 },
      { id: "c-31", name: "B.Tech Ceramic Engineering", duration: "4 Years", fees: 130000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 1000, maxRank: 3500 }
    ]
  },
  {
    id: "col-mnnit",
    name: "Motilal Nehru National Institute of Technology, Allahabad",
    location: "Prayagraj, Uttar Pradesh",
    state: "Uttar Pradesh",
    fees: 148000,
    rating: 4.4,
    establishedYear: 1961,
    description: "MNNIT Allahabad is remarkably famous for its extraordinary Coding culture, producing world-beaters in competitive programming and top recruiters at companies like Google and Amazon.",
    image: "https://images.unsplash.com/photo-1492538368577-878f037a3856?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 93.1,
    averagePackage: 16.5,
    courses: [
      { id: "c-32", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 148000 },
      { id: "c-33", name: "B.Tech Mechanical Engineering", duration: "4 Years", fees: 138000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 800, maxRank: 3000 }
    ]
  },
  {
    id: "col-vnit",
    name: "Visvesvaraya National Institute of Technology, Nagpur",
    location: "Nagpur, Maharashtra",
    state: "Maharashtra",
    fees: 138000,
    rating: 4.3,
    establishedYear: 1960,
    description: "VNIT Nagpur is a premium technical hub with a green, sprawling urban campus, great engineering labs, and a superb record of placements in mechanical, heavy industries, and IT clusters.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 89.2,
    averagePackage: 13.8,
    courses: [
      { id: "c-34", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 138000 },
      { id: "c-35", name: "B.Tech Chemical Engineering", duration: "4 Years", fees: 128000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 1500, maxRank: 4200 }
    ]
  },
  {
    id: "col-manit",
    name: "Maulana Azad National Institute of Technology, Bhopal",
    location: "Bhopal, Madhya Pradesh",
    state: "Madhya Pradesh",
    fees: 142000,
    rating: 4.2,
    establishedYear: 1960,
    description: "MANIT Bhopal features premium infrastructural facilities, incredible cultural programs, and high-impact sports training.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 88.5,
    averagePackage: 12.9,
    courses: [
      { id: "c-36", name: "B.Tech Computer Science", duration: "4 Years", fees: 142000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 2000, maxRank: 5500 }
    ]
  },
  // IIITs
  {
    id: "col-iiit-h",
    name: "International Institute of Information Technology, Hyderabad",
    location: "Gachibowli, Hyderabad, Telangana",
    state: "Telangana",
    fees: 360000,
    rating: 4.8,
    establishedYear: 1998,
    description: "IIIT Hyderabad is a modern research powerhouse. Known in computing circles for possessing arguably the finest coding culture anywhere in Asia, it sets exceptionally high standards in Artificial Intelligence and Natural Language Processing.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 99.1,
    averagePackage: 30.5,
    courses: [
      { id: "c-37", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 360000 },
      { id: "c-38", name: "B.Tech Electronics & Comm Engineeering", duration: "4 Years", fees: 350000 },
      { id: "c-39", name: "MS in Computer Science & Research", duration: "5 Years", fees: 360000 }
    ],
    reviews: [
      { id: "r-7", userName: "Srinivas Goud", rating: 5, comment: "Extremely challenging research workload, but literally no college in India can touch IIIT-H for pure Computer Science." }
    ],
    predictorData: [
      { exam: "JEE Main", minRank: 100, maxRank: 950 }
    ]
  },
  {
    id: "col-iiit-b",
    name: "International Institute of Information Technology, Bangalore",
    location: "Bangalore, Karnataka",
    state: "Karnataka",
    fees: 380000,
    rating: 4.6,
    establishedYear: 1999,
    description: "Located within Bangalore's Silicon Valley hub (Electronic City), IIIT Bangalore is highly focused on industry relations, system architecture, and specialized postgraduate degrees.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 98.4,
    averagePackage: 26.5,
    courses: [
      { id: "c-40", name: "Integrated M.Tech Computer Science", duration: "5 Years", fees: 380000 },
      { id: "c-41", name: "Integrated M.Tech Data Science", duration: "5 Years", fees: 380000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 500, maxRank: 1500 }
    ]
  },
  {
    id: "col-iiit-a",
    name: "Indian Institute of Information Technology, Allahabad",
    location: "Prayagraj, Uttar Pradesh",
    state: "Uttar Pradesh",
    fees: 180000,
    rating: 4.5,
    establishedYear: 1999,
    description: "IIIT Allahabad is highly integrated into competitive coding and software development circles, delivering dynamic packages and producing consistent winners in GSoC and ICPC.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 97.2,
    averagePackage: 20.8,
    courses: [
      { id: "c-42", name: "B.Tech Information Technology", duration: "4 Years", fees: 180000 },
      { id: "c-43", name: "B.Tech Electronics & Comm", duration: "4 Years", fees: 175000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 700, maxRank: 2500 }
    ]
  },
  {
    id: "col-iiit-d",
    name: "Indraprastha Institute of Information Technology, Delhi",
    location: "Okhla, New Delhi, Delhi",
    state: "Delhi",
    fees: 400000,
    rating: 4.5,
    establishedYear: 2008,
    description: "IIIT Delhi is state-funded, academically high-caliber, and extremely modern, promoting research-centric teaching, smart systems, and extensive computing facilities.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 95.9,
    averagePackage: 19.5,
    courses: [
      { id: "c-44", name: "B.Tech Computer Science & AI", duration: "4 Years", fees: 400000 },
      { id: "c-45", name: "B.Tech CS & Applied Mathematics", duration: "4 Years", fees: 395000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 600, maxRank: 2800 }
    ]
  },
  // Elite Private Universities
  {
    id: "col-bits-pilani",
    name: "Birla Institute of Technology and Science, Pilani (BITS)",
    location: "Pilani, Rajasthan",
    state: "Rajasthan",
    fees: 520000,
    rating: 4.8,
    establishedYear: 1964,
    description: "BITS Pilani is India's preeminent private science university, celebrated for its high-impact 'No Reservation' meritocracy, dynamic zero-attendance rules, and the notable 'Practice School' industry apprenticeship scheme.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 96.9,
    averagePackage: 23.2,
    courses: [
      { id: "c-46", name: "B.E. Computer Science & Engineering", duration: "4 Years", fees: 520000 },
      { id: "c-47", name: "B.E. Electronics & Communication", duration: "4 Years", fees: 510000 },
      { id: "c-48", name: "M.Sc. Physics (Dual Degree)", duration: "5 Years", fees: 490000 },
      { id: "c-49", name: "MBA Technology Management", duration: "2 Years", fees: 350000 }
    ],
    reviews: [
      { id: "r-8", userName: "Karan Johar", rating: 5, comment: "Outstanding alumni system. The freedom of BITS is unprecedented; we have no attendance criteria so we spent our nights building startups." }
    ],
    predictorData: [
      { exam: "BITSAT", minRank: 1, maxRank: 400 }
    ]
  },
  {
    id: "col-vit-vellore",
    name: "Vellore Institute of Technology, Vellore (VIT)",
    location: "Vellore, Tamil Nadu",
    state: "Tamil Nadu",
    fees: 198000,
    rating: 4.3,
    establishedYear: 1984,
    description: "VIT Vellore is India's leading private technological giant, containing exceptional smart classrooms, expansive infrastructure, and recorded in the Limca Book of Records for stellar student placements.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 91.2,
    averagePackage: 9.2,
    courses: [
      { id: "c-50", name: "B.Tech Computer Science & Eng", duration: "4 Years", fees: 198000 },
      { id: "c-51", name: "B.Tech Information Technology", duration: "4 Years", fees: 195000 },
      { id: "c-52", name: "M.Tech Software Engineering", duration: "2 Years", fees: 110000 }
    ],
    reviews: [
      { id: "r-9", userName: "Divya Reddy", rating: 4, comment: "Extremely secure campus with solid rules, but the infrastructure and coding club systems are exceptional." }
    ],
    predictorData: [
      { exam: "VITEEE", minRank: 1, maxRank: 15000 }
    ]
  },
  {
    id: "col-srm-chennai",
    name: "SRM Institute of Science and Technology, Chennai",
    location: "Kattankulathur, Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    fees: 260000,
    rating: 4.1,
    establishedYear: 1985,
    description: "SRM Kattankulathur operates on a vast metropolitan scale, featuring excellent global tie-ups, flexible academic frameworks, and lively fests like Milan and Aarush.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 88.2,
    averagePackage: 8.5,
    courses: [
      { id: "c-53", name: "B.Tech Computer Science", duration: "4 Years", fees: 260000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "SRMJEEE", minRank: 1, maxRank: 20000 }
    ]
  },
  {
    id: "col-manipal",
    name: "Manipal Institute of Technology, Manipal",
    location: "Manipal, Udupi, Karnataka",
    state: "Karnataka",
    fees: 335000,
    rating: 4.3,
    establishedYear: 1957,
    description: "MIT Manipal is renowned for high energetic research, a marvelous integrated township in coastal Karnataka, highly creative college projects, and distinguished alumni like Satya Nadella.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 90.5,
    averagePackage: 10.5,
    courses: [
      { id: "c-54", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 335000 },
      { id: "c-55", name: "B.Tech Aeronautical Engineering", duration: "4 Years", fees: 310000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "MET", minRank: 1, maxRank: 12000 }
    ]
  },
  // Famous State Colleges
  {
    id: "col-dtu",
    name: "Delhi Technological University (DTU)",
    location: "Shahbad Daulatpur, New Delhi",
    state: "Delhi",
    fees: 206000,
    rating: 4.6,
    establishedYear: 1941,
    description: "Formerly known as Delhi College of Engineering (DCE), DTU is deep rooted in engineering excellence, pioneering automotive research (Formula Student) and top-tier computational standards.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 94.6,
    averagePackage: 17.2,
    courses: [
      { id: "c-56", name: "B.Tech Software Engineering", duration: "4 Years", fees: 206000 },
      { id: "c-57", name: "B.Tech Computer Science & Eng", duration: "4 Years", fees: 206000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 1000, maxRank: 8500 }
    ]
  },
  {
    id: "col-nsut",
    name: "Netaji Subhas University of Technology (NSUT)",
    location: "Dwarka, New Delhi",
    state: "Delhi",
    fees: 215000,
    rating: 4.5,
    establishedYear: 1983,
    description: "NSUT, located in Dwarka's lush landscape, is prominent for outstanding research centers, intensive computing clusters, and outstanding tech placements across India.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 93.8,
    averagePackage: 16.8,
    courses: [
      { id: "c-58", name: "B.Tech Computer Engineering", duration: "4 Years", fees: 215000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 1200, maxRank: 9500 }
    ]
  },
  {
    id: "col-ceg",
    name: "College of Engineering, Guindy (CEG Anna University)",
    location: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    fees: 55000,
    rating: 4.6,
    establishedYear: 1794,
    description: "CEG Chennai is India's absolute oldest technical institute established in 1794, delivering immensely low tuition costs coupled with massive alumni connections driving global industries.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 92.1,
    averagePackage: 11.2,
    courses: [
      { id: "c-59", name: "B.E. Computer Science & Eng", duration: "4 Years", fees: 55000 },
      { id: "c-60", name: "B.E. Electronics & Communication", duration: "4 Years", fees: 50000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "TNEA", minRank: 1, maxRank: 500 }
    ]
  },
  {
    id: "col-jadavpur",
    name: "Jadavpur University, Faculty of Engineering",
    location: "Kolkata, West Bengal",
    state: "West Bengal",
    fees: 10000,
    rating: 4.7,
    establishedYear: 1906,
    description: "Jadavpur holds legendary prestige in producing unmatched ROI. With tuition fees under ₹3,000 to ₹10,000 for entire courses, it gets ranked with elite IITs for deep scientific research and global software placements.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 96.5,
    averagePackage: 18.5,
    courses: [
      { id: "c-61", name: "B.E. Computer Science & Eng", duration: "4 Years", fees: 2400 },
      { id: "c-62", name: "B.E. Information Technology", duration: "4 Years", fees: 30000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "WBJEE", minRank: 1, maxRank: 150 }
    ]
  },
  {
    id: "col-coep",
    name: "COEP Technological University, Pune",
    location: "Shivajinagar, Pune, Maharashtra",
    state: "Maharashtra",
    fees: 115000,
    rating: 4.4,
    establishedYear: 1854,
    description: "COEP Pune is the third oldest engineering institute in Asia, boasting major historic monuments, rich tech projects, and elite core industrial recruiters.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 91.0,
    averagePackage: 10.8,
    courses: [
      { id: "c-63", name: "B.Tech Computer Engineering", duration: "4 Years", fees: 115000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "MHT-CET", minRank: 1, maxRank: 300 }
    ]
  },
  {
    id: "col-vjti",
    name: "Veermata Jijabai Technological Institute (VJTI)",
    location: "Matunga, Mumbai, Maharashtra",
    state: "Maharashtra",
    fees: 95000,
    rating: 4.4,
    establishedYear: 1887,
    description: "Located centrally in Mumbai, VJTI is highly popular in Maharashtra for massive industrial linkage, top engineering placements, and extreme competitive environment.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 92.5,
    averagePackage: 11.9,
    courses: [
      { id: "c-64", name: "B.Tech Computer Engineering", duration: "4 Years", fees: 95000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "MHT-CET", minRank: 50, maxRank: 450 }
    ]
  },
  {
    id: "col-cbit",
    name: "Chaitanya Bharathi Institute of Technology (CBIT)",
    location: "Gandipet, Hyderabad, Telangana",
    state: "Telangana",
    fees: 140000,
    rating: 4.6,
    establishedYear: 1979,
    description: "CBIT is one of Hyderabad's most prestigious autonomous engineering institutes, widely celebrated for its robust student fests, magnificent academic infrastructure, and spectacular recruiting drives by global technology firms.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 94.2,
    averagePackage: 8.9,
    courses: [
      { id: "cbit-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 140000 },
      { id: "cbit-ece", name: "B.Tech Electronics & Comm", duration: "4 Years", fees: 135000 },
      { id: "cbit-lateral-cse", name: "Lateral B.Tech Computer Science", duration: "3 Years", fees: 140000 }
    ],
    reviews: [
      { id: "cbit-r1", userName: "Gautam K.", rating: 5, comment: "Undisputed king of autonomous engineering colleges in Telangana. Fantastic placements and beautiful CBIT campus lifestyle." }
    ],
    predictorData: [
      { exam: "EMCET", minRank: 1200, maxRank: 14000 },
      { exam: "ECET", minRank: 40, maxRank: 2800 }
    ]
  },
  {
    id: "col-vnrvjiet",
    name: "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)",
    location: "Bachupally, Hyderabad, Telangana",
    state: "Telangana",
    fees: 135000,
    rating: 4.5,
    establishedYear: 1995,
    description: "VNR VJIET is an NAAC A++ accredited autonomous giant in Hyderabad, renowned across India for its creative academic research credits, specialized incubation centres, and stellar IT placement statistics.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 93.5,
    averagePackage: 8.2,
    courses: [
      { id: "vnr-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 135000 },
      { id: "vnr-it", name: "B.Tech Information Technology", duration: "4 Years", fees: 130000 },
      { id: "vnr-lateral-cse", name: "Lateral B.Tech Computer Science", duration: "3 Years", fees: 135000 }
    ],
    reviews: [
      { id: "vnr-r1", userName: "Shruti M.", rating: 4.8, comment: "Outstanding lab equipments and highly supportive professors. Excellent career counseling and corporate outreach." }
    ],
    predictorData: [
      { exam: "EMCET", minRank: 2000, maxRank: 18000 },
      { exam: "ECET", minRank: 80, maxRank: 3500 }
    ]
  },
  {
    id: "col-rvce",
    name: "RV College of Engineering (RVCE)",
    location: "Mysore Road, Bengaluru, Karnataka",
    state: "Karnataka",
    fees: 220000,
    rating: 4.7,
    establishedYear: 1963,
    description: "RVCE is a legendary private, autonomous technical institution in Bengaluru. Widely acknowledged as a powerhouse of quality engineering education, it has deep-rooted connections with multinational giants, providing superb placement opportunities.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 95.8,
    averagePackage: 11.5,
    courses: [
      { id: "rv-cse", name: "B.E. Computer Science & Engineering", duration: "4 Years", fees: 220000 },
      { id: "rv-ise", name: "B.E. Information Science Eng", duration: "4 Years", fees: 215000 },
      { id: "rv-lateral-cse", name: "Lateral B.E. Computer Science", duration: "3 Years", fees: 220000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "KCET", minRank: 100, maxRank: 4000 },
      { exam: "JEE Main", minRank: 1000, maxRank: 9500 }
    ]
  },
  {
    id: "col-heritage",
    name: "Heritage Institute of Technology (HIT)",
    location: "Anandapur, Kolkata, West Bengal",
    state: "West Bengal",
    fees: 110000,
    rating: 4.3,
    establishedYear: 2001,
    description: "Heritage Institute of Technology is West Bengal's leading autonomous private college, offering specialized degrees, expansive green landscaping, and remarkable placement numbers in core and software verticals.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 90.1,
    averagePackage: 6.8,
    courses: [
      { id: "hit-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 110000 },
      { id: "hit-it", name: "B.Tech Information Technology", duration: "4 Years", fees: 105000 },
      { id: "hit-lateral", name: "Lateral B.Tech CSE", duration: "3 Years", fees: 110000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "WBJEE", minRank: 1000, maxRank: 10000 },
      { exam: "JELET", minRank: 150, maxRank: 4500 }
    ]
  },
  {
    id: "col-iit-tirupati",
    name: "IIT Tirupati - Tirupati",
    location: "Tirupati, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 220000,
    rating: 4.7,
    establishedYear: 2015,
    description: "IIT Tirupati is a premier third-generation IIT providing high-quality engineering research, state-of-the-art supercomputing facilities, and outstanding international career placements.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 91.5,
    averagePackage: 15.5,
    courses: [
      { id: "iitt-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 220000 },
      { id: "iitt-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 220000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Advanced", minRank: 2000, maxRank: 4500 }
    ],
    type: "Government"
  },
  {
    id: "col-nit-ap",
    name: "NIT Andhra Pradesh - Tadepalligudem",
    location: "Tadepalligudem, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 135000,
    rating: 4.4,
    establishedYear: 2015,
    description: "An Institute of National Importance under MHRD, situated in Tadepalligudem, establishing premium academic infrastructure with massive software and core placements.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 88.5,
    averagePackage: 8.2,
    courses: [
      { id: "nitap-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 135000 },
      { id: "nitap-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 135500 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 8000, maxRank: 24500 }
    ],
    type: "Government"
  },
  {
    id: "col-iiit-sricity",
    name: "IIIT Sri City - Sri City",
    location: "Sri City, Chittoor, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 280000,
    rating: 4.5,
    establishedYear: 2013,
    description: "IIIT Sri City is an Institute of National Importance located in the industrial smart-city Sri City, offering world-class specialization in Artificial Intelligence and Cyber-security.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 92.0,
    averagePackage: 12.4,
    courses: [
      { id: "iiits-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 280000 },
      { id: "iiits-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 280000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 12000, maxRank: 28000 }
    ],
    type: "Government"
  },
  {
    id: "col-iiit-kurnool",
    name: "IIITDM Kurnool - Kurnool",
    location: "Kurnool, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 145000,
    rating: 4.3,
    establishedYear: 2015,
    description: "Indian Institute of Information Technology Design and Manufacturing Kurnool is an automated center of academic learning, boasting high-caliber technical infrastructure.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 86.4,
    averagePackage: 7.9,
    courses: [
      { id: "iiitdk-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 145000 },
      { id: "iiitdk-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 145000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "JEE Main", minRank: 15000, maxRank: 32000 }
    ],
    type: "Government"
  },
  {
    id: "col-auce",
    name: "Andhra University College of Engineering (AUCE) - Visakhapatnam",
    location: "Visakhapatnam, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 45000,
    rating: 4.6,
    establishedYear: 1946,
    description: "AUCE is a prestigious, state-funded government collegiate university in Visakhapatnam, highly sought after for its distinguished academic lineage, expansive green seaside campus, and historically high core engineering placement lists.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 91.2,
    averagePackage: 7.8,
    courses: [
      { id: "auce-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 45000 },
      { id: "auce-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 45000 },
      { id: "auce-lateral-cse", name: "Lateral B.Tech Computer Science", duration: "3 Years", fees: 45000 }
    ],
    reviews: [
      { id: "auce-r1", userName: "Srinivas R.", rating: 5, comment: "Top-tier faculties, wonderful heritage labs, and very budget-friendly state fees structure." }
    ],
    predictorData: [
      { exam: "EMCET", minRank: 100, maxRank: 1805 },
      { exam: "ECET", minRank: 10, maxRank: 150 }
    ],
    type: "Government"
  },
  {
    id: "col-jntuk",
    name: "JNTUK (University College of Engineering) - Kakinada",
    location: "Kakinada, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 50000,
    rating: 4.5,
    establishedYear: 1946,
    description: "JNTUK is a legendary government technological institution in Kakinada. It acts as a massive educational hub for technical coaching in coastal Andhra Pradesh, celebrated for its rigorous terminal examinations and elite placement lists.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 89.5,
    averagePackage: 7.2,
    courses: [
      { id: "jntuk-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 50000 },
      { id: "jntuk-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 50000 },
      { id: "jntuk-lateral-ece", name: "Lateral B.Tech Electronics & Comm", duration: "3 Years", fees: 50000 }
    ],
    reviews: [
      { id: "jntuk-r1", userName: "Priya K.", rating: 4.6, comment: "Extremely rich terminal coding fests. Wonderful placement packages." }
    ],
    predictorData: [
      { exam: "EMCET", minRank: 150, maxRank: 2500 },
      { exam: "ECET", minRank: 15, maxRank: 250 }
    ],
    type: "Government"
  },
  {
    id: "col-jntua",
    name: "JNTUA (College of Engineering) - Anantapur",
    location: "Anantapur, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 48000,
    rating: 4.4,
    establishedYear: 1946,
    description: "JNTU Anantapur is a premier state government technological university in Rayalaseema, widely celebrated for its rich legacy, brilliant coding cells, and high-impact placement achievements.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 86.8,
    averagePackage: 6.9,
    courses: [
      { id: "jntua-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 48000 },
      { id: "jntua-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 48000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 350, maxRank: 3800 },
      { exam: "ECET", minRank: 20, maxRank: 320 }
    ],
    type: "Government"
  },
  {
    id: "col-svuce",
    name: "Sri Venkateswara University College of Engineering (SVUCE) - Tirupati",
    location: "Tirupati, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 52000,
    rating: 4.5,
    establishedYear: 1959,
    description: "SVUCE is an elite government engineering college under the prestigious Sri Venkateswara University, acclaimed for its rigorous curriculum, highly senior faculties, and historical placement rankings.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 89.0,
    averagePackage: 7.0,
    courses: [
      { id: "svuce-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 52000 },
      { id: "svuce-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 52000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 250, maxRank: 3100 },
      { exam: "ECET", minRank: 12, maxRank: 220 }
    ],
    type: "Government"
  },
  {
    id: "col-klu",
    name: "Koneru Lakshmaiah Education Foundation (KL University) - Vijayawada/Guntur",
    location: "Guntur, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 260000,
    rating: 4.7,
    establishedYear: 1980,
    description: "KLU is a top-tier private deemed university in Guntur, Andhra Pradesh, boasting extremely modern campus infrastructure, NAAC A++ accreditation, a 100% placement track record, and a dynamic student life.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 97.5,
    averagePackage: 8.5,
    courses: [
      { id: "klu-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 260000 },
      { id: "klu-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 250000 },
      { id: "klu-lateral-cse", name: "Lateral B.Tech Computer Science", duration: "3 Years", fees: 260000 }
    ],
    reviews: [
      { id: "klu-r1", userName: "Venkatesh S.", rating: 4.9, comment: "Amazing labs, corporate infrastructure partnerships, and unmatched placements track record." }
    ],
    predictorData: [
      { exam: "EMCET", minRank: 8000, maxRank: 42000 },
      { exam: "ECET", minRank: 200, maxRank: 4500 }
    ],
    type: "Private"
  },
  {
    id: "col-gitam",
    name: "GITAM School of Technology - Visakhapatnam",
    location: "Visakhapatnam, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 275000,
    rating: 4.4,
    establishedYear: 1980,
    description: "GITAM is an elite private deemed university in Visakhapatnam, featuring stunning beach-front campus infrastructure, global technical tie-ups, and exceptional recruitment across prominent MNC firms.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 91.0,
    averagePackage: 7.5,
    courses: [
      { id: "gitam-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 275000 },
      { id: "gitam-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 275000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 9500, maxRank: 48000 },
      { exam: "ECET", minRank: 250, maxRank: 5200 }
    ],
    type: "Private"
  },
  {
    id: "col-srm-ap",
    name: "SRM University, AP - Amaravati",
    location: "Amaravati, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 250000,
    rating: 4.6,
    establishedYear: 2017,
    description: "SRM University AP, located in the capital city Amaravati, is a world-class private campus with highly prominent global tie-ups, research-focused labs, and outstanding technical recruiters.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 94.5,
    averagePackage: 9.1,
    courses: [
      { id: "srmap-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 250000 },
      { id: "srmap-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 245000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 7500, maxRank: 38000 },
      { exam: "JEE Main", minRank: 15000, maxRank: 35000 }
    ],
    type: "Private"
  },
  {
    id: "col-vit-ap",
    name: "VIT-AP - Amaravati",
    location: "Amaravati, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 198000,
    rating: 4.5,
    establishedYear: 2017,
    description: "Sustaining Vellore Institute of Technology's premium educational lineage, VIT-AP offers excellent smart-classrooms, coding-centric clubs, and a centralized placements cell securing stellar packages.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 93.8,
    averagePackage: 8.9,
    courses: [
      { id: "vitap-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 198000 },
      { id: "vitap-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 195000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 6500, maxRank: 32000 },
      { exam: "JEE Main", minRank: 12000, maxRank: 29000 }
    ],
    type: "Private"
  },
  {
    id: "col-jntuk-v",
    name: "JNTUK University College of Engineering - Vizianagaram",
    location: "Vizianagaram, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 40000,
    rating: 4.2,
    establishedYear: 2007,
    description: "A premier constituent government engineering college under JNTU Kakinada, noted for its budget-friendly quality instruction, highly qualified faculties, and reliable placements.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 84.5,
    averagePackage: 5.6,
    courses: [
      { id: "jntukv-cse", name: "B.Tech Computer Science", duration: "4 Years", fees: 40000 },
      { id: "jntukv-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 40000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 3000, maxRank: 15000 },
      { exam: "ECET", minRank: 90, maxRank: 1800 }
    ],
    type: "Government"
  },
  {
    id: "col-gvpce",
    name: "Gayatri Vidya Parishad College of Engineering (GVPCE) - Visakhapatnam",
    location: "Visakhapatnam, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 105000,
    rating: 4.5,
    establishedYear: 1996,
    description: "GVPCE is an autonomous educational giant in Visakhapatnam, renowned across India for its strong discipline, intensive industry interactions, research-oriented laboratory ecosystems, and excellent software placements.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 93.4,
    averagePackage: 6.5,
    courses: [
      { id: "gvpce-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 105000 },
      { id: "gvpce-ece", name: "B.Tech Electronics & Comm", duration: "4 Years", fees: 105000 },
      { id: "gvpce-lateral-cse", name: "Lateral B.Tech Computer Science", duration: "3 Years", fees: 105000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 1800, maxRank: 14050 },
      { exam: "ECET", minRank: 45, maxRank: 850 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-srkr",
    name: "SRKR Engineering College - Bhimavaram",
    location: "Bhimavaram, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 98000,
    rating: 4.4,
    establishedYear: 1980,
    description: "One of the oldest private autonomous engineering colleges in Andhra Pradesh, located in Bhimavaram. Renowned for its unparalleled student culture, extensive labs, and powerful software recruitments.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 91.5,
    averagePackage: 6.0,
    courses: [
      { id: "srkr-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 98000 },
      { id: "srkr-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 98000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 2200, maxRank: 16500 },
      { exam: "ECET", minRank: 55, maxRank: 950 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-rvrjc",
    name: "RVR & JC College of Engineering - Guntur",
    location: "Chowdavaram, Guntur, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 110000,
    rating: 4.4,
    establishedYear: 1985,
    description: "An prestigious autonomous institution under Nagarjuna University, widely recognized as a premium center for technical fests, highly disciplined coding culture, and spectacular placement indices.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 91.0,
    averagePackage: 6.1,
    courses: [
      { id: "rvrjc-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 110000 },
      { id: "rvrjc-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 110000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 2400, maxRank: 18000 },
      { exam: "ECET", minRank: 60, maxRank: 1100 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-aditya",
    name: "Aditya Engineering College - Surampalem",
    location: "Surampalem, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 85000,
    rating: 4.2,
    establishedYear: 2001,
    description: "An autonomous, highly energetic institute situated in Surampalem, recognized for outstanding technical infrastructure, spacious green campus, and vast student placement campaigns.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 86.2,
    averagePackage: 5.2,
    courses: [
      { id: "aec-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 85000 },
      { id: "aec-ece", name: "B.Tech Electronics & Comm Engineering", duration: "4 Years", fees: 85000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 6500, maxRank: 35000 },
      { exam: "ECET", minRank: 150, maxRank: 3200 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-gmrit",
    name: "GMR Institute of Technology (GMRIT) - Rajam",
    location: "Rajam, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 95000,
    rating: 4.3,
    establishedYear: 1997,
    description: "GMRIT is an autonomous private college backed by the GMR Group, situated in a state-of-the-art residential green campus in Rajam. Highly reputed for its experiential learning, mandatory industry internships, and outstanding career development tracks.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 88.0,
    averagePackage: 5.8,
    courses: [
      { id: "gmrit-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 95000 },
      { id: "gmrit-it", name: "B.Tech Information Technology", duration: "4 Years", fees: 95000 },
      { id: "gmrit-lateral", name: "Lateral B.Tech Computer Science", duration: "3 Years", fees: 95000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 5000, maxRank: 24000 },
      { exam: "ECET", minRank: 120, maxRank: 1800 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-vignan-guntur",
    name: "Vignan's Foundation for Science, Technology & Research - Guntur",
    location: "Vadlamudi, Guntur, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 180000,
    rating: 4.5,
    establishedYear: 2008,
    description: "A prominent private deemed university near Guntur, famous for its lush green campus layout, industry-integrated course metrics, and powerful student training securing premium positions.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 92.5,
    averagePackage: 7.1,
    courses: [
      { id: "vignan-cse", name: "B.Tech Computer Science & Engineering", duration: "4 Years", fees: 180000 },
      { id: "vignan-ece", name: "B.Tech Electronics & Comm", duration: "4 Years", fees: 175000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 5505, maxRank: 28500 },
      { exam: "JEE Main", minRank: 10000, maxRank: 25000 }
    ],
    type: "Private"
  },
  {
    id: "col-pvpsit",
    name: "Prasad V Potluri Siddhartha Institute of Technology (PVPSIT) - Vijayawada",
    location: "Vijayawada, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 110000,
    rating: 4.3,
    establishedYear: 1998,
    description: "Under the Siddhartha Academy, PVPSIT is an autonomous pioneer in Kanuru, Vijayawada. Highly acclaimed for its stellar IT placement metrics, advanced laboratories, and student fests.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 89.4,
    averagePackage: 5.9,
    courses: [
      { id: "pvp-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 110000 },
      { id: "pvp-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 105000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 4200, maxRank: 21000 },
      { exam: "ECET", minRank: 95, maxRank: 1450 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-vishnu",
    name: "Vishnu Institute of Technology - Bhimavaram",
    location: "Bhimavaram, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 102000,
    rating: 4.4,
    establishedYear: 2008,
    description: "An elite autonomous private engineering college associated with Sri Vishnu Educational Society. Notorious for creative tech incubations, industry partnerships, and stellar software recruitments.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 92.5,
    averagePackage: 6.3,
    courses: [
      { id: "vitb-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 102000 },
      { id: "vitb-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 102000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 3100, maxRank: 17500 },
      { exam: "ECET", minRank: 70, maxRank: 1150 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-anits",
    name: "Anil Neerukonda Institute of Technology & Sciences (ANITS) - Bheemunipatnam",
    location: "Bheemunipatnam, Visakhapatnam, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 99000,
    rating: 4.3,
    establishedYear: 2001,
    description: "ANITS is an elite autonomous college in the Visakhapatnam region, featuring beautiful landscape layout, high academic standards, and strong software placement index.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 88.0,
    averagePackage: 5.6,
    courses: [
      { id: "anits-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 99000 },
      { id: "anits-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 95000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 3800, maxRank: 19500 },
      { exam: "ECET", minRank: 85, maxRank: 1300 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-gprec",
    name: "G. Pulla Reddy Engineering College - Kurnool",
    location: "Kurnool, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 112000,
    rating: 4.4,
    establishedYear: 1984,
    description: "A highly acclaimed old-heritage autonomous technical institution in Rayalaseema, offering outstanding facilities, supreme teaching faculties, and massive core and IT placement drives.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 90.5,
    averagePackage: 6.2,
    courses: [
      { id: "gprec-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 112000 },
      { id: "gprec-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 112000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 2800, maxRank: 16000 },
      { exam: "ECET", minRank: 50, maxRank: 1000 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-sven",
    name: "Sree Vidyanikethan Engineering College - Tirupati",
    location: "Sree Sainath Nagar, Tirupati, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 125000,
    rating: 4.5,
    establishedYear: 1996,
    description: "One of the largest autonomous colleges in Rayalaseema, founded by Padmashri Dr. M. Mohan Babu. Celebrated for elite technical events, robust training, and deep placement arrays with topmost MNC firms.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 92.0,
    averagePackage: 6.4,
    courses: [
      { id: "sven-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 125000 },
      { id: "sven-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 125000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 3200, maxRank: 18500 },
      { exam: "ECET", minRank: 75, maxRank: 1250 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-mits",
    name: "Madhanapalle Institute of Technology & Science (MITS) - Madanapalle",
    location: "Madanapalle, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 93000,
    rating: 4.3,
    establishedYear: 1998,
    description: "An active autonomous research-focused colossus in Madanapalle, recognized for top-notch global university partnerships, highly supportative faculties, and expansive tech placements indexes.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 87.5,
    averagePackage: 5.4,
    courses: [
      { id: "mits-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 93000 },
      { id: "mits-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 90000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 5500, maxRank: 26000 },
      { exam: "ECET", minRank: 130, maxRank: 2100 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-raghu",
    name: "Raghu Engineering College - Bheemunipatnam",
    location: "Visakhapatnam, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 90000,
    rating: 4.2,
    establishedYear: 2001,
    description: "Raghu Engineering College is an autonomous powerhouse in Vizag, featuring premium laboratory infrastructure, intense industrial training, and highly successful software placement services.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 86.8,
    averagePackage: 5.3,
    courses: [
      { id: "raghu-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 90000 },
      { id: "raghu-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 90000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 5800, maxRank: 27500 },
      { exam: "ECET", minRank: 140, maxRank: 2300 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-lbrce",
    name: "Lakireddy Bali Reddy College of Engineering (LBRCE) - Mylavaram",
    location: "Mylavaram, Krishna, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 96000,
    rating: 4.3,
    establishedYear: 1998,
    description: "An NAAC A grade autonomous pioneer in Krishna District, known for supreme teaching paradigms, intensive research facilities, and excellent IT and core placement achievements.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 88.2,
    averagePackage: 5.5,
    courses: [
      { id: "lbrce-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 96000 },
      { id: "lbrce-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 96000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 4800, maxRank: 22000 },
      { exam: "ECET", minRank: 110, maxRank: 1650 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-viit",
    name: "Vignan's Institute of Information Technology - Visakhapatnam",
    location: "Duvvada, Visakhapatnam, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 93500,
    rating: 4.3,
    establishedYear: 2002,
    description: "An state-of-the-art autonomous destination under Vignan Group, widely praised for custom educational methodologies, excellent coding laboratories, and highly successful recruitment rates.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 89.0,
    averagePackage: 5.6,
    courses: [
      { id: "viit-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 93500 },
      { id: "viit-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 93500 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 4500, maxRank: 23000 },
      { exam: "ECET", minRank: 105, maxRank: 1550 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-gudla",
    name: "Gudlavalleru Engineering College - Gudlavalleru",
    location: "Gudlavalleru, Krishna, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 88000,
    rating: 4.2,
    establishedYear: 1998,
    description: "A highly prestigious, highly values-driven autonomous engineering institute in coastal Andhra, delivering incredible technical programs, brilliant labs, and high placements index.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 86.5,
    averagePackage: 5.1,
    courses: [
      { id: "gud-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 88000 },
      { id: "gud-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 88000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 6200, maxRank: 29000 },
      { exam: "ECET", minRank: 145, maxRank: 2450 }
    ],
    type: "Autonomous"
  },
  {
    id: "col-rgm",
    name: "Rajeev Gandhi Memorial College of Engineering & Technology - Nandyal",
    location: "Nandyal, Kurnool District, Andhra Pradesh",
    state: "Andhra Pradesh",
    fees: 91000,
    rating: 4.2,
    establishedYear: 1995,
    description: "A pioneering autonomous technical college in Nandyal, renowned for supreme career-guidance cells, multi-disciplinary labs, and strong corporate networks delivering reliable career placement index.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    placementPercentage: 85.0,
    averagePackage: 5.0,
    courses: [
      { id: "rgm-cse", name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: 91000 },
      { id: "rgm-ece", name: "B.Tech Electronics Engineering", duration: "4 Years", fees: 91000 }
    ],
    reviews: [],
    predictorData: [
      { exam: "EMCET", minRank: 6800, maxRank: 31000 },
      { exam: "ECET", minRank: 160, maxRank: 2605 }
    ],
    type: "Autonomous"
  }
];

// Dynamically generate standard colleges up to 50+ dynamically if list is shorter,
// but let's expand lists explicitly so that the seed database is robust and matches exactly 51 colleges.
const STATES = ["Maharashtra", "Tamil Nadu", "Delhi", "Karnataka", "West Bengal", "Uttar Pradesh", "Assam", "Telangana", "Andhra Pradesh", "Gujarat", "Rajasthan", "Punjab", "Haryana"];
const EXAMS = ["JEE Main", "JEE Advanced", "GATE", "BITSAT", "MHT-CET", "WBJEE", "EMCET", "ECET", "JELET", "KCET"];

function enrichStaticColleges(colleges: College[]): College[] {
  return colleges.map(c => {
    // 1. Assign type (respect manual type declaration if it exists)
    let ownershipType: 'Government' | 'Private' | 'Autonomous' = c.type || 'Government';
    if (!c.type) {
      const nameLower = c.name.toLowerCase();
      if (nameLower.includes('bits') || nameLower.includes('vellore') || nameLower.includes('srm') || nameLower.includes('manipal') || nameLower.includes('lovely') || nameLower.includes('amity') || nameLower.includes('private')) {
        ownershipType = 'Private';
      } else if (nameLower.includes('coep') || nameLower.includes('vjti') || nameLower.includes('iiit') || nameLower.includes('international institute') || nameLower.includes('autonomous') || nameLower.includes('vnr') || nameLower.includes('cbit') || nameLower.includes('griet') || nameLower.includes('heritage') || nameLower.includes('rvce') || nameLower.includes('bms')) {
        ownershipType = 'Autonomous';
      } else {
        ownershipType = 'Government';
      }
    }

    // 2. Add extra state entrance test cutoffs (skip national government institutes)
    const currentExams = c.predictorData.map(p => p.exam.toUpperCase());
    const extraData = [...c.predictorData];

    const nameLowerForNational = c.name.toLowerCase();
    const isNationalGovtCollege = nameLowerForNational.includes('iit ') ||
      nameLowerForNational.includes('nit ') ||
      nameLowerForNational.includes('iiit ') ||
      nameLowerForNational.includes('- tirupati') ||
      nameLowerForNational.includes('tadepalligudem') ||
      nameLowerForNational.includes('sri city') ||
      nameLowerForNational.includes('kurnool') ||
      nameLowerForNational.includes('indian institute') ||
      nameLowerForNational.includes('national institute');

    if ((c.state === "Telangana" || c.state === "Andhra Pradesh") && !isNationalGovtCollege) {
      if (!currentExams.includes('EMCET') && !currentExams.includes('EAMCET')) {
        const offset = ownershipType === 'Government' ? 500 : (ownershipType === 'Autonomous' ? 3000 : 8000);
        extraData.push({
          exam: "EMCET",
          minRank: Math.floor(100 + offset),
          maxRank: Math.floor(1200 + offset * 6)
        });
      }
      if (!currentExams.includes('ECET')) {
        const offset = ownershipType === 'Government' ? 20 : (ownershipType === 'Autonomous' ? 120 : 350);
        extraData.push({
          exam: "ECET",
          minRank: Math.floor(10 + offset),
          maxRank: Math.floor(100 + offset * 4)
        });
      }
    } else if (c.state === "Maharashtra" && !isNationalGovtCollege) {
      if (!currentExams.includes('MHT-CET') && !currentExams.includes('MHTCET')) {
        const offset = ownershipType === 'Government' ? 80 : (ownershipType === 'Autonomous' ? 1500 : 5000);
        extraData.push({
          exam: "MHT-CET",
          minRank: Math.floor(50 + offset),
          maxRank: Math.floor(600 + offset * 5)
        });
      }
    } else if (c.state === "West Bengal" && !isNationalGovtCollege) {
      if (!currentExams.includes('WBJEE')) {
        const offset = ownershipType === 'Government' ? 100 : (ownershipType === 'Autonomous' ? 2000 : 6000);
        extraData.push({
          exam: "WBJEE",
          minRank: Math.floor(50 + offset),
          maxRank: Math.floor(500 + offset * 4)
        });
      }
      if (!currentExams.includes('JELET')) {
        const offset = ownershipType === 'Government' ? 15 : (ownershipType === 'Autonomous' ? 100 : 300);
        extraData.push({
          exam: "JELET",
          minRank: Math.floor(5 + offset),
          maxRank: Math.floor(80 + offset * 5)
        });
      }
    } else if (c.state === "Karnataka" && !isNationalGovtCollege) {
      if (!currentExams.includes('KCET')) {
        const offset = ownershipType === 'Government' ? 200 : (ownershipType === 'Autonomous' ? 2500 : 7000);
        extraData.push({
          exam: "KCET",
          minRank: Math.floor(100 + offset),
          maxRank: Math.floor(800 + offset * 4)
        });
      }
    }

    return {
      ...c,
      type: ownershipType,
      predictorData: extraData
    };
  });
}

function autoGenerateColleges(existing: College[]): College[] {
  const result = [...existing];
  const countNeeded = 54 - result.length;
  if (countNeeded <= 0) return result;

  const prefixes = ["PSG College", "Thapar Institute", "Amity University", "Kalinga Institute", "Symbiosis Institute", "Chandigarh University", "Lovely Professional University", "Dhirubhai Ambani Institute", "Shiv Nadar University", "RV College of Engineering", "PE Society’s Christ University", "Nirma Institute of Technology", "Northeastern Hill University", "Indian Institute of Science Education", "Satyabhama University", "SASTRA Deemed University", "PEC University", "Tezpur Central University", "Vishwavidyalaya Institute", "Netaji Subhas Institute"];
  const cities = ["Coimbatore", "Patiala", "Noida", "Bhubaneswar", "Pune", "Chandigarh", "Jalandhar", "Gandhinagar", "Greater Noida", "Bangalore", "Bangalore", "Ahmedabad", "Shillong", "Bhopal", "Chennai", "Thanjavur", "Chandigarh", "Tezpur", "Jaipur", "Kochi"];

  for (let i = 0; i < countNeeded; i++) {
    const state = STATES[i % STATES.length];
    const city = cities[i % cities.length];
    const prefix = prefixes[i % prefixes.length];
    const uniqueId = `col-auto-${i}`;
    const fees = Math.floor(80000 + (Math.random() * 400000));
    const rating = parseFloat((3.8 + (Math.random() * 0.9)).toFixed(1));

    const isAutonomous = prefix.toLowerCase().includes("psg") || prefix.toLowerCase().includes("thapar") || prefix.toLowerCase().includes("dhirubhai") || prefix.toLowerCase().includes("rv college") || prefix.toLowerCase().includes("nirma");
    const isPrivate = prefix.toLowerCase().includes("amity") || prefix.toLowerCase().includes("lovely") || prefix.toLowerCase().includes("srm") || prefix.toLowerCase().includes("symbiosis") || prefix.toLowerCase().includes("kalinga") || prefix.toLowerCase().includes("chandigarh") || prefix.toLowerCase().includes("christ");
    const ownershipType: 'Government' | 'Private' | 'Autonomous' = isAutonomous ? "Autonomous" : (isPrivate ? "Private" : "Government");

    // Dynamic state-wise predictor data based on state name
    const predictorData: PredictorData[] = [];
    if (state === "Telangana" || state === "Andhra Pradesh") {
      predictorData.push({
        exam: "EMCET",
        minRank: Math.floor(1000 + (Math.random() * 8000)),
        maxRank: Math.floor(15000 + (Math.random() * 25000))
      });
      predictorData.push({
        exam: "ECET",
        minRank: Math.floor(10 + (Math.random() * 150)),
        maxRank: Math.floor(500 + (Math.random() * 2000))
      });
    } else if (state === "Maharashtra") {
      predictorData.push({
        exam: "MHT-CET",
        minRank: Math.floor(500 + (Math.random() * 4000)),
        maxRank: Math.floor(10000 + (Math.random() * 30000))
      });
    } else if (state === "West Bengal") {
      predictorData.push({
        exam: "WBJEE",
        minRank: Math.floor(400 + (Math.random() * 3000)),
        maxRank: Math.floor(8000 + (Math.random() * 20000))
      });
      predictorData.push({
        exam: "JELET",
        minRank: Math.floor(20 + (Math.random() * 200)),
        maxRank: Math.floor(400 + (Math.random() * 1500))
      });
    } else if (state === "Karnataka") {
      predictorData.push({
        exam: "KCET",
        minRank: Math.floor(300 + (Math.random() * 3500)),
        maxRank: Math.floor(6000 + (Math.random() * 18000))
      });
    } else {
      predictorData.push({
        exam: "JEE Main",
        minRank: Math.floor(5000 + (Math.random() * 20000)),
        maxRank: Math.floor(25000 + (Math.random() * 50000))
      });
    }

    result.push({
      id: uniqueId,
      name: `${prefix}, ${city} (${prefix.split(" ").map(w => w[0]).join("")})`,
      location: `${city}, ${state}`,
      state: state,
      fees: fees,
      rating: rating,
      establishedYear: 1980 + (i % 35),
      description: `${prefix} is a highly accomplished center of academic research, known for its creative pedagogical approaches, modern computer labs, sports arenas, and specialized placement coaching, making it highly impactful in ${state}.`,
      image: `https://images.unsplash.com/photo-${1500000000000 + (i * 100000)}?q=80&w=600&auto=format&fit=crop`,
      placementPercentage: parseFloat((82 + (Math.random() * 15)).toFixed(1)),
      averagePackage: parseFloat((5.5 + (Math.random() * 10)).toFixed(1)),
      courses: [
        { id: `ca-${i}-1`, name: "B.Tech Computer Science Engineering", duration: "4 Years", fees: fees },
        { id: `ca-${i}-2`, name: "B.Tech Information Technology", duration: "4 Years", fees: Math.floor(fees * 0.9) },
        { id: `ca-${i}-3`, name: "B.Tech Electronics Engineering", duration: "4 Years", fees: Math.floor(fees * 0.8) }
      ],
      reviews: [
        { id: `ra-${i}-1`, userName: "Aravind K.", rating: Math.round(rating), comment: "Good environment, spacious labs, and beautiful green grounds. Dynamic campus active networks." }
      ],
      predictorData,
      type: ownershipType
    });
  }
  return result;
}

// Complete Seed Set
const ALL_COLLEGES = autoGenerateColleges(enrichStaticColleges(INITIAL_COLLEGES));

// Initialize DB structure
let inMemoryDb: DatabaseSchema = {
  users: [],
  colleges: ALL_COLLEGES,
  savedColleges: [],
  savedComparisons: []
};

// Check and load from file system
export function loadDatabase(): DatabaseSchema {
  // Only load, never save here to avoid infinite loops with watchers
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(content);
      // Ensure colleges are always present
      inMemoryDb.colleges = ALL_COLLEGES;
    } else {
      // If file doesn't exist, use memory db
      inMemoryDb.colleges = ALL_COLLEGES;
    }
  } catch (err) {
    console.error('Error loading db.json, using in-memory seeds', err);
    inMemoryDb.colleges = ALL_COLLEGES;
  }
  return inMemoryDb;
}

// Export database operations
export function getColleges(filters: {
  q?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  course?: string;
  sortBy?: string; // "fees" | "rating" | "placements" | "established"
  sortOrder?: "asc" | "desc";
  collegeType?: string;
  exam?: string;
}) {
  const db = loadDatabase();
  let list = [...db.colleges];

  const q = filters.q?.toLowerCase().trim();
  if (q) {
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  if (filters.location && filters.location !== "All") {
    const loc = filters.location.toLowerCase().trim();
    list = list.filter(c => c.state.toLowerCase() === loc || c.location.toLowerCase().includes(loc));
  }

  if (filters.minFees !== undefined) {
    list = list.filter(c => c.fees >= filters.minFees!);
  }

  if (filters.maxFees !== undefined) {
    list = list.filter(c => c.fees <= filters.maxFees!);
  }

  if (filters.course && filters.course !== "All") {
    const crs = filters.course.toLowerCase();
    list = list.filter(c => c.courses.some(course => course.name.toLowerCase().includes(crs)));
  }

  if (filters.collegeType && filters.collegeType !== "All") {
    list = list.filter(c => c.type === filters.collegeType);
  }

  if (filters.exam && filters.exam !== "All") {
    const examLower = filters.exam.toLowerCase();
    // Filter matching colleges supporting this exam
    list = list.filter(c => c.predictorData.some(entry => entry.exam.toLowerCase() === examLower));

    // If other than JEE Main or JEE Advanced, strictly filter by state mapping
    if (examLower !== 'jee main' && examLower !== 'jee advanced') {
      const EXAM_STATE_MAPPING: Record<string, string[]> = {
        'mht-cet': ['Maharashtra'],
        'wbjee': ['West Bengal'],
        'jelet': ['West Bengal'],
        'kcet': ['Karnataka'],
        'emcet': ['Andhra Pradesh', 'Telangana'],
        'ecet': ['Andhra Pradesh', 'Telangana']
      };
      const allowedStates = EXAM_STATE_MAPPING[examLower];
      if (allowedStates) {
        list = list.filter(c => allowedStates.includes(c.state));
      }
    }
  }

  // Sorting
  const sortBy = filters.sortBy || "rating";
  const order = filters.sortOrder || "desc";

  list.sort((a, b) => {
    let fieldA = 0;
    let fieldB = 0;

    if (sortBy === "fees") {
      fieldA = a.fees;
      fieldB = b.fees;
    } else if (sortBy === "rating") {
      fieldA = a.rating;
      fieldB = b.rating;
    } else if (sortBy === "placements") {
      fieldA = a.placementPercentage;
      fieldB = b.placementPercentage;
    } else if (sortBy === "established") {
      fieldA = a.establishedYear;
      fieldB = b.establishedYear;
    }

    if (order === "asc") {
      return fieldA - fieldB;
    } else {
      return fieldB - fieldA;
    }
  });

  return list;
}

export function getCollegeById(id: string) {
  const db = loadDatabase();
  return db.colleges.find(c => c.id === id) || null;
}

export function registerUser(name: string, email: string, passwordHash: string): User | null {
  const db = loadDatabase();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return null;

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);
  return newUser;
}

export function getUserByEmail(email: string): User | null {
  const db = loadDatabase();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id: string): User | null {
  const db = loadDatabase();
  return db.users.find(u => u.id === id) || null;
}

// Saved College
export function saveCollege(userId: string, collegeId: string) {
  const db = loadDatabase();
  const exists = db.savedColleges.some(sc => sc.userId === userId && sc.collegeId === collegeId);
  if (exists) return { success: true, message: 'Already saved' };

  db.savedColleges.push({
    id: `sc-${Date.now()}`,
    userId,
    collegeId,
    savedAt: new Date().toISOString()
  });

  saveDatabase(db);
  return { success: true };
}

export function unsaveCollege(userId: string, collegeId: string) {
  const db = loadDatabase();
  db.savedColleges = db.savedColleges.filter(sc => !(sc.userId === userId && sc.collegeId === collegeId));
  saveDatabase(db);
  return { success: true };
}

export function getSavedColleges(userId: string) {
  const db = loadDatabase();
  const collegeIds = db.savedColleges.filter(sc => sc.userId === userId).map(sc => sc.collegeId);
  return db.colleges.filter(c => collegeIds.includes(c.id));
}

// Saved Comparison
export function saveComparison(userId: string, collegeIds: string[]) {
  const db = loadDatabase();
  // Filter duplicates
  const key = collegeIds.sort().join(',');
  const exists = db.savedComparisons.some(sc => sc.userId === userId && sc.collegeIds.sort().join(',') === key);

  if (exists) return { success: true, message: 'Comparison already saved' };

  db.savedComparisons.push({
    id: `comp-${Date.now()}`,
    userId,
    collegeIds,
    savedAt: new Date().toISOString()
  });

  saveDatabase(db);
  return { success: true };
}

export function getSavedComparisons(userId: string) {
  const db = loadDatabase();
  const comps = db.savedComparisons.filter(sc => sc.userId === userId);
  return comps.map(c => {
    const list = db.colleges.filter(co => c.collegeIds.includes(co.id));
    return {
      id: c.id,
      collegeIds: c.collegeIds,
      colleges: list,
      savedAt: c.savedAt
    };
  });
}

export function deleteComparison(userId: string, id: string) {
  const db = loadDatabase();
  db.savedComparisons = db.savedComparisons.filter(sc => !(sc.userId === userId && sc.id === id));
  saveDatabase(db);
  return { success: true };
}

// Review submissions
export function addReview(collegeId: string, userName: string, rating: number, comment: string) {
  const db = loadDatabase();
  const college = db.colleges.find(c => c.id === collegeId);
  if (!college) return null;

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    userName,
    rating,
    comment
  };

  college.reviews.push(newReview);

  // Recalculate college average rating
  const total = college.reviews.reduce((acc, r) => acc + r.rating, 0);
  college.rating = parseFloat((total / college.reviews.length).toFixed(1));

  saveDatabase(db);
  return college;
}

// Predictor mapping
export function predictColleges(exam: string, rank: number) {
  const db = loadDatabase();

  // Mapping state-wise exams to their respective states to enforce strict local relevance
  const EXAM_STATE_MAPPING: Record<string, string[]> = {
    'MHT-CET': ['Maharashtra'],
    'WBJEE': ['West Bengal'],
    'JELET': ['West Bengal'],
    'KCET': ['Karnataka'],
    'EMCET': ['Andhra Pradesh', 'Telangana'],
    'ECET': ['Andhra Pradesh', 'Telangana']
  };

  const normalizedExam = exam.toUpperCase();
  const allowedStates = EXAM_STATE_MAPPING[normalizedExam] || null;

  // Find colleges where rank lies within reasonable ranges for their cutoff bounds
  const matches = db.colleges.filter(college => {
    // If it is a state-specific exam, ensure the college belongs to the appropriate state
    if (allowedStates && !allowedStates.includes(college.state)) {
      return false;
    }

    return college.predictorData.some(entry => {
      // Must match exam type
      if (entry.exam.toLowerCase() !== exam.toLowerCase()) return false;
      // Filter where rank is within the threshold (usually maxRank represents closing rank, minRank opening rank)
      // If cutoff closing rank is >= user rank, they have a chance!
      return rank <= entry.maxRank;
    });
  });

  return matches.map(college => {
    const entry = college.predictorData.find(e => e.exam.toLowerCase() === exam.toLowerCase())!;
    // Calculate custom recommendation strength based on rank proximity
    const diff = entry.maxRank - rank;
    const range = entry.maxRank - entry.minRank || 1000;
    let probability: 'High' | 'Medium' | 'Low' = 'Low';

    if (rank <= entry.minRank) probability = 'High';
    else if (diff > (range * 0.3)) probability = 'Medium';
    else probability = 'Low';

    return {
      college,
      cutoffMin: entry.minRank,
      cutoffMax: entry.maxRank,
      probability
    };
  });
}
