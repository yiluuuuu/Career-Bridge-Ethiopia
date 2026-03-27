import { PrismaClient, JobType, JobSite, ExperienceLevel, EducationLevel, Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // 1. Create Categories
    const categories = [
        { name: "Information Technology", slug: "it", icon: "monitor", color: "#0ea5e9" },
        { name: "Banking & Finance", slug: "banking", icon: "landmark", color: "#6366f1" },
        { name: "NGO & Non-Profit", slug: "ngo", icon: "globe", color: "#10b981" },
        { name: "Engineering", slug: "engineering", icon: "hammer", color: "#f59e0b" },
        { name: "Healthcare", slug: "healthcare", icon: "heart", color: "#ef4444" },
        { name: "Education", slug: "education", icon: "graduation", color: "#8b5cf6" },
        { name: "Marketing & Sales", slug: "marketing", icon: "megaphone", color: "#ec4899" },
        { name: "Human Resources", slug: "hr", icon: "users", color: "#64748b" },
        { name: "Manufacturing", slug: "manufacturing", icon: "building", color: "#475569" },
        { name: "Logistics", slug: "logistics", icon: "truck", color: "#d97706" },
    ];

    const categoryMap: Record<string, string> = {};

    for (const cat of categories) {
        const created = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        });
        categoryMap[cat.slug] = created.id;
        console.log(`- Category ${cat.name} created`);
    }

    // 2. Create Companies
    const companies = [
        { name: "Ethio Telecom", website: "https://www.ethiotelecom.et" },
        { name: "Commercial Bank of Ethiopia", website: "https://www.combanketh.et" },
        { name: "Save the Children", website: "https://ethiopia.savethechildren.net" },
        { name: "Safaricom Ethiopia", website: "https://www.safaricom.et" },
        { name: "Ethiopian Airlines", website: "https://www.ethiopianairlines.com" },
        { name: "Dangalé Foods", website: "https://dangale.com" },
    ];

    const companyMap: Record<string, string> = {};

    for (const comp of companies) {
        const created = await prisma.company.upsert({
            where: { name: comp.name },
            update: comp,
            create: comp,
        });
        companyMap[comp.name] = created.id;
        console.log(`- Company ${comp.name} created`);
    }

    // 3. Create Sample Jobs
    const jobs = [
        {
            title: "Senior Full Stack Developer",
            description: "We are looking for an experienced Full Stack Developer to lead our digital transformation team. You will be responsible for developing high-quality web applications using Next.js and React.\nCollaborate with cross-functional teams to define, design, and ship new features.\nEnsure the performance, quality, and responsiveness of applications.",
            requirements: "• 5+ years of experience in web development\n• Proficiency in React, Node.js, and TypeScript\n• Experience with PostgreSQL and Prisma\n• Strong problem-solving skills",
            salary: "ETB 45,000 - 60,000",
            location: "Addis Ababa",
            jobType: JobType.FULL_TIME,
            jobSite: JobSite.HYBRID,
            experienceLevel: ExperienceLevel.SENIOR,
            educationLevel: EducationLevel.BACHELOR,
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            categorySlug: "it",
            companyName: "Ethio Telecom",
            isFeatured: true,
        },
        {
            title: "Relationship Manager",
            description: "Join Ethiopia's largest bank as a Relationship Manager. You will be responsible for maintaining strong relationships with our corporate clients and driving business growth.",
            requirements: "• Degree in Banking, Finance, or Management\n• 3+ years of experience in the banking sector\n• Excellent communication and interpersonal skills",
            salary: "ETB 30,000 - 40,000",
            location: "Adama",
            jobType: JobType.FULL_TIME,
            jobSite: JobSite.ON_SITE,
            experienceLevel: ExperienceLevel.INTERMEDIATE,
            educationLevel: EducationLevel.BACHELOR,
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            categorySlug: "banking",
            companyName: "Commercial Bank of Ethiopia",
            isFeatured: false,
        },
        {
            title: "Monitoring & Evaluation Officer",
            description: "Save the Children is looking for an M&E Officer to support our education projects in Hawassa. The officer will track project progress and ensure data quality.",
            requirements: "• Degree in Social Sciences, Statistics, or related field\n• Previous experience in NGO sector is highly preferred\n• Proficiency in data analysis software",
            salary: "Competitive",
            location: "Hawassa",
            jobType: JobType.CONTRACTUAL,
            jobSite: JobSite.ON_SITE,
            experienceLevel: ExperienceLevel.JUNIOR,
            educationLevel: EducationLevel.BACHELOR,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            categorySlug: "ngo",
            companyName: "Save the Children",
            isFeatured: true,
        },
        {
            title: "Network Engineer",
            description: "Join the Safaricom Ethiopia team to help build our growing network infrastructure. You will be responsible for network design, implementation, and troubleshooting.",
            requirements: "• Degree in Electrical Engineering or Computer Science\n• CCNA or equivalent certification\n• Experience with Huawei or Cisco equipment",
            salary: "ETB 35,000+",
            location: "Addis Ababa",
            jobType: JobType.FULL_TIME,
            jobSite: JobSite.ON_SITE,
            experienceLevel: ExperienceLevel.INTERMEDIATE,
            educationLevel: EducationLevel.BACHELOR,
            deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            categorySlug: "it",
            companyName: "Safaricom Ethiopia",
            isFeatured: false,
        },
        {
            title: "Mechanical Engineer",
            description: "Ethiopian Airlines is seeking a talented Mechanical Engineer for our maintenance division. Ensure the safety and reliability of our aircraft systems.",
            requirements: "• Degree in Mechanical or Aeronautical Engineering\n• Strong technical skills and attention to detail\n• Ability to work in shifts",
            salary: "ETB 25,000 - 35,000",
            location: "Addis Ababa",
            jobType: JobType.FULL_TIME,
            jobSite: JobSite.ON_SITE,
            experienceLevel: ExperienceLevel.ENTRY,
            educationLevel: EducationLevel.BACHELOR,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            categorySlug: "engineering",
            companyName: "Ethiopian Airlines",
            isFeatured: false,
        },
        {
            title: "Marketing Intern",
            description: "Gain hands-on experience in marketing at Dangalé Foods. Help us develop social media campaigns and conduct market research.",
            requirements: "• Current student or recent graduate in Marketing\n• Creative mindset and good writing skills\n• Eagerness to learn",
            salary: "ETB 5,000 (Stipend)",
            location: "Bishoftu",
            jobType: JobType.INTERN_PAID,
            jobSite: JobSite.HYBRID,
            experienceLevel: ExperienceLevel.ENTRY,
            educationLevel: EducationLevel.DIPLOMA,
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            categorySlug: "marketing",
            companyName: "Dangalé Foods",
            isFeatured: false,
        },
    ];

    for (const job of jobs) {
        const { categorySlug, companyName, ...jobData } = job;
        await prisma.job.create({
            data: {
                ...jobData,
                categoryId: categoryMap[categorySlug],
                companyId: companyMap[companyName],
            },
        });
        console.log(`- Job ${job.title} created`);
    }

    console.log("Seeding finished!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
