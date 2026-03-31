import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create a demo employer user
  const employer = await prisma.user.upsert({
    where: { email: "employer@demo.com" },
    update: {},
    create: {
      name: "Demo Employer",
      email: "employer@demo.com",
      role: "EMPLOYER",
    },
  })

  // Create jobs
  const jobs = [
    {
      title: "Senior React Developer",
      company: "Google",
      location: "Bangalore, India",
      type: "FULL_TIME",
      salary: "₹25L - ₹40L",
      category: "Engineering",
      description: `We are looking for a Senior React Developer to join our growing team at Google. You will be responsible for building and maintaining high-quality web applications that serve millions of users worldwide.\n\nYou will work closely with our product and design teams to deliver exceptional user experiences. This is an exciting opportunity to work on cutting-edge technology at one of the world's leading tech companies.`,
      requirements: `5+ years of experience with React.js\nStrong proficiency in TypeScript\nExperience with Next.js and server-side rendering\nKnowledge of state management (Redux, Zustand)\nFamiliarity with REST APIs and GraphQL\nExperience with testing frameworks (Jest, React Testing Library)\nStrong understanding of web performance optimization\nExcellent communication skills`,
    },
    {
      title: "Full Stack Engineer",
      company: "Microsoft",
      location: "Hyderabad, India",
      type: "FULL_TIME",
      salary: "₹20L - ₹35L",
      category: "Engineering",
      description: `Microsoft is seeking a talented Full Stack Engineer to join our Azure team. You will design, develop, and maintain scalable web applications and APIs that power our cloud services.\n\nThis role offers the opportunity to work with the latest technologies and contribute to products used by millions of businesses worldwide.`,
      requirements: `4+ years of full stack development experience\nProficiency in Node.js and React\nExperience with cloud platforms (Azure, AWS)\nStrong knowledge of databases (SQL and NoSQL)\nExperience with Docker and Kubernetes\nUnderstanding of CI/CD pipelines\nGood problem-solving skills`,
    },
    {
      title: "UI/UX Designer",
      company: "Flipkart",
      location: "Bangalore, India",
      type: "FULL_TIME",
      salary: "₹15L - ₹25L",
      category: "Design",
      description: `Flipkart is looking for a creative UI/UX Designer to help shape the future of e-commerce in India. You will create intuitive and beautiful user experiences for our mobile and web platforms.\n\nYou will collaborate with product managers, engineers, and business stakeholders to deliver designs that delight our 400+ million customers.`,
      requirements: `3+ years of UI/UX design experience\nProficiency in Figma and Adobe XD\nStrong portfolio showcasing mobile and web designs\nExperience with user research and usability testing\nKnowledge of design systems\nUnderstanding of accessibility standards\nAbility to work in a fast-paced environment`,
    },
    {
      title: "DevOps Engineer",
      company: "Amazon",
      location: "Remote",
      type: "REMOTE",
      salary: "₹22L - ₹38L",
      category: "Engineering",
      description: `Amazon Web Services is hiring a DevOps Engineer to help build and maintain our infrastructure. You will work on automating deployments, improving system reliability, and scaling our services to handle massive traffic.\n\nThis is a fully remote position with flexible working hours.`,
      requirements: `3+ years of DevOps experience\nStrong knowledge of AWS services\nExperience with Terraform and Infrastructure as Code\nProficiency in Docker and Kubernetes\nExperience with CI/CD tools (Jenkins, GitHub Actions)\nScripting skills in Python or Bash\nKnowledge of monitoring tools (Prometheus, Grafana)`,
    },
    {
      title: "Product Manager",
      company: "Swiggy",
      location: "Bangalore, India",
      type: "FULL_TIME",
      salary: "₹18L - ₹30L",
      category: "Marketing",
      description: `Swiggy is looking for an experienced Product Manager to drive the growth of our food delivery platform. You will own the product roadmap, work with engineering and design teams, and make data-driven decisions to improve user experience.\n\nJoin us in our mission to change the way India eats!`,
      requirements: `4+ years of product management experience\nStrong analytical and data-driven mindset\nExperience with A/B testing and experimentation\nExcellent communication and stakeholder management\nAbility to write clear product specifications\nExperience with agile methodologies\nPassion for consumer products`,
    },
    {
      title: "Data Scientist",
      company: "Zomato",
      location: "Gurugram, India",
      type: "FULL_TIME",
      salary: "₹20L - ₹32L",
      category: "Engineering",
      description: `Zomato is seeking a Data Scientist to join our analytics team. You will build machine learning models to improve restaurant recommendations, delivery time predictions, and customer personalization.\n\nYou will work with petabytes of data and have a direct impact on the experience of millions of users.`,
      requirements: `3+ years of data science experience\nStrong proficiency in Python and SQL\nExperience with ML frameworks (TensorFlow, PyTorch, scikit-learn)\nKnowledge of statistical modeling and analysis\nExperience with big data tools (Spark, Hadoop)\nStrong communication skills to present findings\nPhD or Masters in a quantitative field preferred`,
    },
    {
      title: "Frontend Developer",
      company: "Razorpay",
      location: "Bangalore, India",
      type: "FULL_TIME",
      salary: "₹12L - ₹22L",
      category: "Engineering",
      description: `Razorpay is hiring a Frontend Developer to build the next generation of payment experiences. You will work on our dashboard, checkout flows, and developer tools used by thousands of businesses.\n\nWe are a fast-growing fintech company with a strong engineering culture.`,
      requirements: `2+ years of frontend development experience\nStrong knowledge of React and JavaScript\nExperience with TypeScript\nUnderstanding of web performance and optimization\nFamiliarity with payment flows is a plus\nAttention to detail and pixel-perfect implementation\nGood understanding of cross-browser compatibility`,
    },
    {
      title: "Backend Engineer",
      company: "CRED",
      location: "Bangalore, India",
      type: "FULL_TIME",
      salary: "₹18L - ₹28L",
      category: "Engineering",
      description: `CRED is looking for a Backend Engineer to build scalable and reliable systems for our credit card payment platform. You will design APIs, optimize database queries, and ensure high availability of our services.\n\nWe are building India's most trusted financial platform.`,
      requirements: `3+ years of backend development experience\nStrong knowledge of Java or Go\nExperience with microservices architecture\nProficiency in SQL and NoSQL databases\nKnowledge of message queues (Kafka, RabbitMQ)\nExperience with distributed systems\nUnderstanding of security best practices`,
    },
    {
      title: "Marketing Manager",
      company: "Meesho",
      location: "Bangalore, India",
      type: "FULL_TIME",
      salary: "₹14L - ₹22L",
      category: "Marketing",
      description: `Meesho is seeking a Marketing Manager to drive growth for our social commerce platform. You will develop and execute marketing campaigns, manage social media presence, and analyze campaign performance.\n\nJoin us in empowering millions of small businesses across India.`,
      requirements: `4+ years of digital marketing experience\nExperience with performance marketing and paid ads\nStrong analytical skills and data-driven approach\nKnowledge of SEO and content marketing\nExperience with marketing automation tools\nExcellent written and verbal communication\nCreative thinking and problem-solving skills`,
    },
    {
      title: "iOS Developer",
      company: "PhonePe",
      location: "Bangalore, India",
      type: "FULL_TIME",
      salary: "₹16L - ₹28L",
      category: "Engineering",
      description: `PhonePe is hiring an iOS Developer to build features for our payments app used by 400+ million Indians. You will work on performance-critical code that handles millions of transactions daily.\n\nBe part of India's leading digital payments platform.`,
      requirements: `3+ years of iOS development experience\nStrong proficiency in Swift\nExperience with UIKit and SwiftUI\nKnowledge of payment SDKs and security\nExperience with Core Data and networking\nUnderstanding of App Store guidelines\nPassion for building great mobile experiences`,
    },
    {
      title: "HR Business Partner",
      company: "Infosys",
      location: "Pune, India",
      type: "FULL_TIME",
      salary: "₹10L - ₹18L",
      category: "HR",
      description: `Infosys is looking for an HR Business Partner to support our engineering teams. You will partner with business leaders to drive talent acquisition, employee engagement, and organizational development initiatives.\n\nJoin one of India's largest IT companies.`,
      requirements: `5+ years of HR experience\nExperience as an HRBP in a tech company\nStrong knowledge of labor laws and compliance\nExcellent interpersonal and communication skills\nExperience with HRIS systems\nAbility to handle sensitive situations with discretion\nMBA in HR preferred`,
    },
    {
      title: "React Native Developer",
      company: "Ola",
      location: "Bangalore, India",
      type: "CONTRACT",
      salary: "₹8L - ₹15L",
      category: "Engineering",
      description: `Ola is seeking a React Native Developer for a 6-month contract to help build new features for our driver and rider apps. You will work with our mobile team to deliver high-quality cross-platform experiences.\n\nThis is a contract role with possibility of full-time conversion.`,
      requirements: `2+ years of React Native experience\nStrong JavaScript and TypeScript skills\nExperience with native modules and bridging\nKnowledge of mobile app performance optimization\nFamiliarity with maps and location services\nExperience with push notifications\nAbility to work independently`,
    },
    {
      title: "Finance Analyst",
      company: "Paytm",
      location: "Noida, India",
      type: "FULL_TIME",
      salary: "₹8L - ₹14L",
      category: "Finance",
      description: `Paytm is hiring a Finance Analyst to support our financial planning and analysis team. You will prepare financial models, analyze business performance, and provide insights to support strategic decisions.\n\nBe part of India's leading fintech company.`,
      requirements: `2+ years of finance or accounting experience\nStrong Excel and financial modeling skills\nExperience with ERP systems (SAP, Oracle)\nKnowledge of Indian accounting standards\nCA or MBA Finance preferred\nStrong analytical and problem-solving skills\nAttention to detail and accuracy`,
    },
    {
      title: "Sales Executive",
      company: "Freshworks",
      location: "Chennai, India",
      type: "FULL_TIME",
      salary: "₹6L - ₹12L",
      category: "Sales",
      description: `Freshworks is looking for a Sales Executive to drive revenue growth for our SaaS products. You will prospect new customers, conduct product demos, and close deals with SMB and enterprise clients.\n\nJoin a global SaaS company headquartered in Chennai.`,
      requirements: `2+ years of B2B sales experience\nExperience selling SaaS products\nStrong communication and presentation skills\nAbility to manage a sales pipeline\nExperience with CRM tools (Salesforce, HubSpot)\nSelf-motivated and target-driven\nFluency in English and Tamil preferred`,
    },
    {
      title: "Graphic Designer",
      company: "Byju's",
      location: "Bangalore, India",
      type: "INTERNSHIP",
      salary: "₹15,000/month",
      category: "Design",
      description: `Byju's is offering a 6-month internship for a Graphic Designer to create visual content for our educational platform. You will design illustrations, infographics, and marketing materials that make learning fun and engaging.\n\nGreat opportunity for fresh graduates to kickstart their design career.`,
      requirements: `Pursuing or completed degree in Design or related field\nProficiency in Adobe Illustrator and Photoshop\nBasic knowledge of motion graphics is a plus\nCreative portfolio showcasing design work\nAbility to work in a fast-paced environment\nGood communication skills\nPassion for education and learning`,
    },
  ]

  for (const job of jobs) {
    await prisma.job.create({
      data: {
        ...job,
        type: job.type as any,
        userId: employer.id,
      },
    })
  }

  console.log(`✅ Created ${jobs.length} jobs`)
  console.log("🎉 Seeding complete!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
