package com.careerpath.backend.config;

import com.careerpath.backend.model.Career;
import com.careerpath.backend.model.Course;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.CareerRepository;
import com.careerpath.backend.repository.CourseRepository;
import com.careerpath.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final CareerRepository careerRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (careerRepository.count() == 0) {
            loadCareers();
        } else {
            System.out.println("ℹ️  Careers already loaded (" + careerRepository.count() + " records)");
        }

        if (courseRepository.count() == 0) {
            loadCourses();
        } else {
            System.out.println("ℹ️  Courses already loaded (" + courseRepository.count() + " records)");
        }

        if (userRepository.count() == 0) {
            loadDemoUsers();
        } else {
            System.out.println("ℹ️  Users already present (" + userRepository.count() + " records)");
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CAREERS
    // ─────────────────────────────────────────────────────────────────────────
    private void loadCareers() {
        List<Career> careers = new ArrayList<>();

        // ── Technology ───────────────────────────────────────────────────────
        careers.add(Career.builder().name("Software Engineer").category("Technology")
            .description("Design, develop and maintain software systems and applications.")
            .skills(List.of("Java","Python","Algorithms","Data Structures","Git","System Design"))
            .salaryRange("₹4L – ₹50L+ per year").icon("💻").color("#3b62f5")
            .degrees(List.of("B.Tech CS","BCA","B.Sc CS","MCA"))
            .topUniversities(List.of("IIT Bombay","IIT Delhi","BITS Pilani","NIT Trichy","VIT Vellore"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("AI/ML Engineer").category("Technology")
            .description("Build intelligent systems using machine learning and deep learning.")
            .skills(List.of("Python","TensorFlow","PyTorch","Mathematics","Data Analysis","NLP"))
            .salaryRange("₹8L – ₹80L+ per year").icon("🤖").color("#7c3aed")
            .degrees(List.of("B.Tech CS/AI","M.Tech AI/ML","M.Sc Data Science"))
            .topUniversities(List.of("IIT Madras","IIT Hyderabad","IIIT Hyderabad","IISc Bangalore"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Data Scientist").category("Technology")
            .description("Extract insights from large datasets using statistical and ML techniques.")
            .skills(List.of("Python","R","SQL","Statistics","Machine Learning","Data Visualization"))
            .salaryRange("₹6L – ₹60L per year").icon("📊").color("#0891b2")
            .degrees(List.of("B.Tech CS","M.Sc Statistics","M.Sc Data Science"))
            .topUniversities(List.of("ISI Kolkata","CMI Chennai","IIT Bombay","Delhi University"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Cybersecurity Engineer").category("Technology")
            .description("Protect computer systems and networks from digital attacks and breaches.")
            .skills(List.of("Network Security","Ethical Hacking","Cryptography","Linux","Python","VAPT"))
            .salaryRange("₹5L – ₹45L per year").icon("🔒").color("#dc2626")
            .degrees(List.of("B.Tech CS","CEH Certification","CISSP"))
            .topUniversities(List.of("IIT Kanpur","NIT Surathkal","IIIT Bangalore","VIT Vellore"))
            .jobOutlook("Very Good").build());

        careers.add(Career.builder().name("Full Stack Developer").category("Technology")
            .description("Build both frontend and backend of complete web applications.")
            .skills(List.of("React","Node.js","MongoDB","REST APIs","HTML/CSS","JavaScript"))
            .salaryRange("₹4L – ₹40L per year").icon("🌐").color("#059669")
            .degrees(List.of("B.Tech CS","BCA","B.Sc IT"))
            .topUniversities(List.of("BITS Pilani","VIT Vellore","Manipal University","SRM University"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("DevOps Engineer").category("Technology")
            .description("Bridge development and operations for continuous delivery pipelines.")
            .skills(List.of("Docker","Kubernetes","CI/CD","Linux","Terraform","Scripting"))
            .salaryRange("₹6L – ₹50L per year").icon("⚙️").color("#d97706")
            .degrees(List.of("B.Tech CS/IT","AWS/Linux Certifications"))
            .topUniversities(List.of("IITs","NITs","IIIT Hyderabad","BITS Pilani"))
            .jobOutlook("Very Good").build());

        careers.add(Career.builder().name("Cloud Architect").category("Technology")
            .description("Design, build and manage scalable cloud computing infrastructure.")
            .skills(List.of("AWS","Azure","GCP","DevOps","Networking","Security","Microservices"))
            .salaryRange("₹12L – ₹80L per year").icon("☁️").color("#0369a1")
            .degrees(List.of("B.Tech CS/IT","AWS/Azure Certifications"))
            .topUniversities(List.of("IITs","NITs","BITS Pilani","VIT Vellore"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Robotics Engineer").category("Technology")
            .description("Design, build and program robots and automated systems.")
            .skills(List.of("C++","Python","ROS","Mechanical Design","Control Systems","Computer Vision"))
            .salaryRange("₹5L – ₹40L per year").icon("🦾").color("#7c3aed")
            .degrees(List.of("B.Tech Robotics/Mechanical","M.Tech Robotics"))
            .topUniversities(List.of("IIT Bombay","IIT Kanpur","IIT Madras","IIT Kharagpur"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Game Developer").category("Technology")
            .description("Create video games for consoles, PC, and mobile platforms.")
            .skills(List.of("Unity","Unreal Engine","C#","C++","3D Modeling","Game Design"))
            .salaryRange("₹3L – ₹30L per year").icon("🎮").color("#4f46e5")
            .degrees(List.of("B.Tech CS","B.Des Game Design","B.Sc Animation"))
            .topUniversities(List.of("MAAC","Whistling Woods","Arena Animation","ICAT Design"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("UX/UI Designer").category("Technology")
            .description("Design intuitive, accessible and beautiful user interfaces and experiences.")
            .skills(List.of("Figma","Adobe XD","User Research","Wireframing","Prototyping","Typography"))
            .salaryRange("₹3L – ₹35L per year").icon("🎨").color("#ec4899")
            .degrees(List.of("B.Des","BCA","B.Sc Visual Communication"))
            .topUniversities(List.of("NID Ahmedabad","IIT Bombay IDC","NID Delhi","Srishti Bangalore"))
            .jobOutlook("Very Good").build());

        careers.add(Career.builder().name("Blockchain Developer").category("Technology")
            .description("Build decentralized applications, smart contracts and Web3 solutions.")
            .skills(List.of("Solidity","Ethereum","Web3.js","Cryptography","JavaScript","Rust"))
            .salaryRange("₹6L – ₹60L per year").icon("⛓️").color("#0891b2")
            .degrees(List.of("B.Tech CS","Blockchain Certification"))
            .topUniversities(List.of("IITs","BITS Pilani","IIIT Hyderabad","VIT Vellore"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Product Manager").category("Technology")
            .description("Guide technology product development from idea to launch.")
            .skills(List.of("Product Strategy","Data Analysis","Communication","UX","Agile","Roadmapping"))
            .salaryRange("₹8L – ₹60L per year").icon("🎯").color("#7c3aed")
            .degrees(List.of("B.Tech + MBA","Any Technical Degree","MBA"))
            .topUniversities(List.of("IITs","IIMs","BITS Pilani","ISB Hyderabad"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Ethical Hacker").category("Technology")
            .description("Identify and fix security vulnerabilities through authorised penetration testing.")
            .skills(List.of("Penetration Testing","Networking","Kali Linux","Cryptography","Python"))
            .salaryRange("₹5L – ₹50L per year").icon("🕵️").color("#dc2626")
            .degrees(List.of("B.Tech CS","CEH","OSCP Certification"))
            .topUniversities(List.of("IIT Kanpur","IIIT Hyderabad","NIT Warangal"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Quantum Computing Researcher").category("Technology")
            .description("Develop quantum algorithms and push the frontier of quantum computers.")
            .skills(List.of("Quantum Mechanics","Linear Algebra","Python","Qiskit","Physics","Mathematics"))
            .salaryRange("₹8L – ₹60L per year").icon("⚛️").color("#0369a1")
            .degrees(List.of("M.Sc Physics/CS","PhD Quantum Computing"))
            .topUniversities(List.of("IISc Bangalore","TIFR Mumbai","IIT Bombay"))
            .jobOutlook("Future").build());

        // ── Engineering ──────────────────────────────────────────────────────
        careers.add(Career.builder().name("Mechanical Engineer").category("Engineering")
            .description("Design and develop mechanical systems, machines and manufacturing processes.")
            .skills(List.of("CAD/CAM","Thermodynamics","Manufacturing","Material Science","AutoCAD","ANSYS"))
            .salaryRange("₹3L – ₹20L per year").icon("⚙️").color("#78716c")
            .degrees(List.of("B.Tech Mechanical","M.Tech Mechanical","GATE"))
            .topUniversities(List.of("IIT Delhi","IIT Roorkee","NIT Warangal","IIT Madras"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Civil Engineer").category("Engineering")
            .description("Design and oversee construction of buildings, roads, bridges and infrastructure.")
            .skills(List.of("Structural Analysis","AutoCAD","Project Management","Surveying","STAAD Pro"))
            .salaryRange("₹3L – ₹25L per year").icon("🏗️").color("#92400e")
            .degrees(List.of("B.Tech Civil","M.Tech Structural Engineering"))
            .topUniversities(List.of("IIT Roorkee","IIT Madras","NIT Calicut","BITS Pilani"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Aerospace Engineer").category("Engineering")
            .description("Design aircraft, spacecraft, satellites and defense systems.")
            .skills(List.of("Aerodynamics","Propulsion","Structural Analysis","MATLAB","CFD","Avionics"))
            .salaryRange("₹4L – ₹30L per year").icon("🚀").color("#1d4ed8")
            .degrees(List.of("B.Tech Aerospace","M.Tech Aerospace"))
            .topUniversities(List.of("IIT Bombay","IIT Kanpur","IISc Bangalore","IIST Trivandrum"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("EV Engineer").category("Engineering")
            .description("Design electric vehicles, battery management systems and EV charging infrastructure.")
            .skills(List.of("Battery Technology","Power Electronics","Embedded Systems","Mechanical Design"))
            .salaryRange("₹5L – ₹30L per year").icon("🔋").color("#059669")
            .degrees(List.of("B.Tech EE/Mechanical","M.Tech EV Technology"))
            .topUniversities(List.of("IIT Bombay","IIT Delhi","NIT Trichy","VIT Vellore"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Chemical Engineer").category("Engineering")
            .description("Design processes for manufacturing chemicals, food, pharmaceuticals and fuels.")
            .skills(List.of("Process Design","Thermodynamics","Reaction Engineering","Safety","Aspen Plus"))
            .salaryRange("₹3L – ₹18L per year").icon("🧪").color("#16a34a")
            .degrees(List.of("B.Tech Chemical","M.Tech Chemical"))
            .topUniversities(List.of("IIT Bombay","IIT Delhi","NIT Trichy","BITS Pilani"))
            .jobOutlook("Moderate").build());

        careers.add(Career.builder().name("Biomedical Engineer").category("Engineering")
            .description("Apply engineering principles to develop medical devices and diagnostic equipment.")
            .skills(List.of("Biology","Electronics","Signal Processing","Programming","Medical Devices"))
            .salaryRange("₹3L – ₹20L per year").icon("🩺").color("#0891b2")
            .degrees(List.of("B.Tech Biomedical","M.Tech Biomedical"))
            .topUniversities(List.of("IIT Hyderabad","AIIMS","IIT Kharagpur","Manipal University"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Naval Engineer").category("Engineering")
            .description("Design, build and maintain ships, submarines and offshore platforms.")
            .skills(List.of("Naval Architecture","Marine Engineering","CAD","Hydrodynamics","Structural Analysis"))
            .salaryRange("₹4L – ₹25L per year").icon("⚓").color("#0369a1")
            .degrees(List.of("B.Tech Naval Architecture","Marine Engineering"))
            .topUniversities(List.of("IIT Kharagpur","Cochin University","IIT Madras","DIAT Pune"))
            .jobOutlook("Moderate").build());

        careers.add(Career.builder().name("Petroleum Engineer").category("Engineering")
            .description("Develop methods for extracting oil and gas from the earth efficiently.")
            .skills(List.of("Reservoir Engineering","Drilling Technology","Thermodynamics","Geology"))
            .salaryRange("₹5L – ₹40L per year").icon("🛢️").color("#78716c")
            .degrees(List.of("B.Tech Petroleum","M.Tech Petroleum"))
            .topUniversities(List.of("IIT Dhanbad ISM","IIT Guwahati","UPES Dehradun"))
            .jobOutlook("Moderate").build());

        // ── Medicine & Health ─────────────────────────────────────────────────
        careers.add(Career.builder().name("Doctor (MBBS)").category("Medicine")
            .description("Diagnose and treat illnesses, injuries and medical conditions.")
            .skills(List.of("Clinical Knowledge","Anatomy","Pharmacology","Patient Care","Diagnosis"))
            .salaryRange("₹5L – ₹1Cr+ per year").icon("🏥").color("#dc2626")
            .degrees(List.of("MBBS","MD","MS"))
            .topUniversities(List.of("AIIMS Delhi","CMC Vellore","JIPMER Puducherry","MAMC Delhi"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Dentist").category("Medicine")
            .description("Diagnose and treat dental and oral health conditions.")
            .skills(List.of("Dental Procedures","Patient Care","Oral Surgery","Radiology","Orthodontics"))
            .salaryRange("₹4L – ₹50L per year").icon("🦷").color("#0891b2")
            .degrees(List.of("BDS","MDS"))
            .topUniversities(List.of("Maulana Azad Dental College","SDM College Dharwad","AIIMS"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Pharmacist").category("Medicine")
            .description("Dispense medications and provide expert pharmaceutical care to patients.")
            .skills(List.of("Pharmacology","Drug Interactions","Patient Counseling","Chemistry","Clinical Skills"))
            .salaryRange("₹2.5L – ₹15L per year").icon("💊").color("#7c3aed")
            .degrees(List.of("B.Pharm","Pharm.D","M.Pharm"))
            .topUniversities(List.of("ICT Mumbai","Jamia Hamdard","JSS Mysore","Manipal University"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Psychologist").category("Medicine")
            .description("Assess and treat mental health conditions and human behaviour problems.")
            .skills(List.of("Counseling","Psychological Assessment","Research","Empathy","CBT","Communication"))
            .salaryRange("₹3L – ₹20L per year").icon("🧠").color("#8b5cf6")
            .degrees(List.of("B.Sc Psychology","MA Psychology","M.Sc Clinical Psychology"))
            .topUniversities(List.of("TISS Mumbai","Delhi University","Bangalore University","NIMHANS"))
            .jobOutlook("Very Good").build());

        careers.add(Career.builder().name("Cardiologist").category("Medicine")
            .description("Specialise in diagnosing and treating heart and cardiovascular diseases.")
            .skills(List.of("Cardiology","Echocardiography","Catheterisation","ECG","Diagnosis"))
            .salaryRange("₹15L – ₹2Cr per year").icon("❤️").color("#dc2626")
            .degrees(List.of("MBBS + MD General Medicine + DM Cardiology"))
            .topUniversities(List.of("AIIMS Delhi","PGIMER Chandigarh","NIMHANS","CMC Vellore"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Radiologist").category("Medicine")
            .description("Diagnose diseases using X-ray, MRI, CT scans and other imaging techniques.")
            .skills(List.of("Medical Imaging","Anatomy","Diagnosis","AI Radiology","Interventional Radiology"))
            .salaryRange("₹10L – ₹80L per year").icon("🔬").color("#0891b2")
            .degrees(List.of("MBBS + MD Radiology"))
            .topUniversities(List.of("AIIMS","PGI Chandigarh","CMC Vellore","Maulana Azad Medical College"))
            .jobOutlook("Excellent").build());

        careers.add(Career.builder().name("Physiotherapist").category("Medicine")
            .description("Restore movement and function to patients affected by injury or disability.")
            .skills(List.of("Anatomy","Exercise Science","Manual Therapy","Patient Assessment","Rehabilitation"))
            .salaryRange("₹2.5L – ₹15L per year").icon("💪").color("#059669")
            .degrees(List.of("BPT","MPT"))
            .topUniversities(List.of("AIIMS","Manipal College","SRM University","CMC Vellore"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Veterinarian").category("Medicine")
            .description("Diagnose and treat health conditions in animals of all species.")
            .skills(List.of("Animal Medicine","Surgery","Diagnostics","Empathy","Pharmacology"))
            .salaryRange("₹3L – ₹20L per year").icon("🐾").color("#059669")
            .degrees(List.of("BVSc & AH","MVSc"))
            .topUniversities(List.of("IVRI Bareilly","GADVASU Ludhiana","TANUVAS Chennai"))
            .jobOutlook("Good").build());

        // ── Government & Defense ──────────────────────────────────────────────
        careers.add(Career.builder().name("IAS Officer").category("Government")
            .description("Senior civil servant responsible for administration of districts and government departments.")
            .skills(List.of("Leadership","Policy Making","Communication","Crisis Management","Public Administration"))
            .salaryRange("₹56,100 – ₹2,50,000 per month").icon("🏛️").color("#d97706")
            .degrees(List.of("Any Graduate – UPSC Civil Services Exam"))
            .topUniversities(List.of("Delhi University","JNU","IITs","Hyderabad Central University"))
            .jobOutlook("Stable").build());

        careers.add(Career.builder().name("IPS Officer").category("Government")
            .description("Senior police official responsible for law enforcement and public order.")
            .skills(List.of("Law","Leadership","Physical Fitness","Investigation","Crisis Management"))
            .salaryRange("₹56,100 – ₹2,25,000 per month").icon("🚔").color("#1d4ed8")
            .degrees(List.of("Any Graduate – UPSC Civil Services Exam"))
            .topUniversities(List.of("Any recognized Indian university"))
            .jobOutlook("Stable").build());

        careers.add(Career.builder().name("IFS Officer").category("Government")
            .description("Represent India diplomatically in foreign countries and international organisations.")
            .skills(List.of("Diplomacy","Foreign Languages","International Relations","Negotiation","Protocol"))
            .salaryRange("₹56,100 – ₹2,50,000 per month").icon("🌏").color("#047857")
            .degrees(List.of("Any Graduate – UPSC Civil Services Exam"))
            .topUniversities(List.of("JNU","Delhi University","HCU Hyderabad","Jadavpur University"))
            .jobOutlook("Stable").build());

        careers.add(Career.builder().name("Indian Army Officer").category("Defense")
            .description("Lead and command soldiers in India's land-based armed forces.")
            .skills(List.of("Leadership","Physical Fitness","Tactical Strategy","Weapons Training","Discipline"))
            .salaryRange("₹56,100 – ₹2,25,000 per month").icon("🎖️").color("#166534")
            .degrees(List.of("Graduate – NDA/CDS/TES Exam","B.Tech – Technical Entry Scheme"))
            .topUniversities(List.of("NDA Pune","IMA Dehradun","OTA Chennai","OTA Gaya"))
            .jobOutlook("Stable").build());

        careers.add(Career.builder().name("Indian Navy Officer").category("Defense")
            .description("Serve in India's naval forces operating warships, submarines and aircraft.")
            .skills(List.of("Navigation","Naval Warfare","Leadership","Engineering","Physical Fitness"))
            .salaryRange("₹56,100 – ₹2,25,000 per month").icon("⚓").color("#1d4ed8")
            .degrees(List.of("Graduate – NDA/CDS","B.Tech – 10+2 Cadet Entry"))
            .topUniversities(List.of("INS Zamorin Kerala","Naval Academy Ezhimala"))
            .jobOutlook("Stable").build());

        careers.add(Career.builder().name("Indian Air Force Pilot").category("Defense")
            .description("Fly fighter jets, transport aircraft and helicopters in India's air force.")
            .skills(List.of("Aviation","Navigation","Emergency Procedures","Physical Fitness","Decision Making"))
            .salaryRange("₹56,100 – ₹2,50,000 per month").icon("✈️").color("#0369a1")
            .degrees(List.of("Graduate – NDA/CDSE/AFCAT","B.Tech – NDA"))
            .topUniversities(List.of("Air Force Academy Dundigal","NDA Khadakwasla Pune"))
            .jobOutlook("Stable").build());

        careers.add(Career.builder().name("Indian Coast Guard Officer").category("Defense")
            .description("Protect India's maritime borders, prevent smuggling and conduct sea rescues.")
            .skills(List.of("Navigation","Maritime Law","Rescue Operations","Physical Fitness","Leadership"))
            .salaryRange("₹44,900 – ₹1,42,400 per month").icon("🛡️").color("#0891b2")
            .degrees(List.of("Graduate – Coast Guard Exam","B.Tech Engineering"))
            .topUniversities(List.of("Any recognised Indian university"))
            .jobOutlook("Stable").build());

        careers.add(Career.builder().name("CRPF Officer").category("Defense")
            .description("Serve in India's Central Reserve Police Force for internal security operations.")
            .skills(List.of("Physical Fitness","Weapons Training","Leadership","Tactical Operations","Discipline"))
            .salaryRange("₹44,900 – ₹1,51,100 per month").icon("🛡️").color("#166534")
            .degrees(List.of("Graduate – UPSC CAPF Exam"))
            .topUniversities(List.of("Any recognised Indian university"))
            .jobOutlook("Stable").build());

        // ── Finance ────────────────────────────────────────────────────────────
        careers.add(Career.builder().name("Chartered Accountant").category("Finance")
            .description("Manage financial records, taxation, audits and strategic financial planning.")
            .skills(List.of("Accounting","Taxation","Audit","Financial Analysis","Corporate Law","Tally"))
            .salaryRange("₹6L – ₹40L+ per year").icon("📒").color("#d97706")
            .degrees(List.of("CA – ICAI Exam (Foundation + Intermediate + Final)","B.Com + CA"))
            .topUniversities(List.of("ICAI – All India Centres"))
            .jobOutlook("Very Good").build());

        careers.add(Career.builder().name("Investment Banker").category("Finance")
            .description("Help corporations raise capital, execute mergers, acquisitions and IPOs.")
            .skills(List.of("Financial Modelling","Valuation","Excel","PowerPoint","Communication","Deal Structuring"))
            .salaryRange("₹8L – ₹1Cr+ per year").icon("💰").color("#065f46")
            .degrees(List.of("MBA Finance","CA","CFA","B.Tech + MBA"))
            .topUniversities(List.of("IIM Ahmedabad","IIM Calcutta","FMS Delhi","ISB Hyderabad"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Financial Analyst").category("Finance")
            .description("Analyse financial data and market trends to guide investment decisions.")
            .skills(List.of("Financial Modelling","Excel","Bloomberg Terminal","Statistics","CFA","Research"))
            .salaryRange("₹4L – ₹25L per year").icon("📈").color("#1d4ed8")
            .degrees(List.of("B.Com","MBA Finance","CFA"))
            .topUniversities(List.of("SRCC Delhi","NMIMS Mumbai","IIM Bangalore","Symbiosis Pune"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Actuary").category("Finance")
            .description("Use mathematics and statistics to assess financial risk for insurance and pensions.")
            .skills(List.of("Statistics","Mathematics","Actuarial Science","Risk Modelling","Excel"))
            .salaryRange("₹5L – ₹35L per year").icon("🧮").color("#7c3aed")
            .degrees(List.of("B.Sc Mathematics/Statistics","Actuarial Science – ASI Exams"))
            .topUniversities(List.of("ASI India","IIT Bombay","Delhi University","ISI Kolkata"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Company Secretary").category("Finance")
            .description("Ensure companies comply with legal, regulatory and corporate governance requirements.")
            .skills(List.of("Corporate Law","Company Law","Governance","Compliance","Communication","SEBI"))
            .salaryRange("₹4L – ₹25L per year").icon("📋").color("#0891b2")
            .degrees(List.of("CS – ICSI Exam","LLB"))
            .topUniversities(List.of("ICSI – All India Centres"))
            .jobOutlook("Good").build());

        // ── Business & Management ──────────────────────────────────────────────
        careers.add(Career.builder().name("Marketing Manager").category("Business")
            .description("Plan, execute and oversee marketing strategies and brand campaigns.")
            .skills(List.of("Digital Marketing","SEO/SEM","Brand Management","Analytics","Content Strategy"))
            .salaryRange("₹4L – ₹30L per year").icon("📣").color("#ea580c")
            .degrees(List.of("MBA Marketing","B.Com","BBA"))
            .topUniversities(List.of("IIM Ahmedabad","XLRI Jamshedpur","MDI Gurugram","MICA Ahmedabad"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Entrepreneur").category("Business")
            .description("Build, launch and scale your own business ventures and startups.")
            .skills(List.of("Leadership","Finance","Marketing","Networking","Product Thinking","Resilience"))
            .salaryRange("Unlimited potential").icon("🚀").color("#f59e0b")
            .degrees(List.of("Any degree (optional)","MBA"))
            .topUniversities(List.of("IITs","IIMs","BITS Pilani","ISB Hyderabad"))
            .jobOutlook("Self-created").build());

        careers.add(Career.builder().name("HR Manager").category("Business")
            .description("Manage talent acquisition, employee development and organisational culture.")
            .skills(List.of("Recruitment","Labour Law","Communication","Conflict Resolution","HRMS","Training"))
            .salaryRange("₹4L – ₹25L per year").icon("👥").color("#0891b2")
            .degrees(List.of("MBA HR","MSW","BBA","PGDM HR"))
            .topUniversities(List.of("XLRI Jamshedpur","TISS Mumbai","IIM Kozhikode","Symbiosis Pune"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Digital Marketing Specialist").category("Business")
            .description("Drive online brand presence and lead generation through digital channels.")
            .skills(List.of("SEO","Google Ads","Social Media","Content Marketing","Analytics","Email Marketing"))
            .salaryRange("₹2.5L – ₹20L per year").icon("📱").color("#ec4899")
            .degrees(List.of("BBA","MBA Marketing","Digital Marketing Certification","BMS"))
            .topUniversities(List.of("MICA Ahmedabad","IIM Calcutta","Symbiosis Pune"))
            .jobOutlook("Very Good").build());

        // ── Creative & Media ──────────────────────────────────────────────────
        careers.add(Career.builder().name("Graphic Designer").category("Creative")
            .description("Create compelling visual content for digital, print and brand communication.")
            .skills(List.of("Adobe Photoshop","Illustrator","InDesign","Typography","Branding","UI Design"))
            .salaryRange("₹2L – ₹20L per year").icon("🎨").color("#ec4899")
            .degrees(List.of("B.Des Visual Communication","B.FA","Diploma Graphic Design"))
            .topUniversities(List.of("NID Ahmedabad","IIT Bombay IDC","Symbiosis Pune","Pearl Academy"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Film Director").category("Creative")
            .description("Direct and create films, documentaries, web series and digital content.")
            .skills(List.of("Storytelling","Cinematography","Editing","Leadership","Script Writing","Vision"))
            .salaryRange("₹3L – ₹2Cr+ per year").icon("🎬").color("#dc2626")
            .degrees(List.of("B.FA Film Direction","Diploma Film Direction","Film School"))
            .topUniversities(List.of("FTII Pune","SRFTI Kolkata","Whistling Woods Mumbai"))
            .jobOutlook("Competitive").build());

        careers.add(Career.builder().name("Journalist").category("Creative")
            .description("Report, investigate and communicate news across print, digital and broadcast media.")
            .skills(List.of("Writing","Research","Investigation","Communication","Media Ethics","Digital Tools"))
            .salaryRange("₹2.5L – ₹20L per year").icon("📰").color("#0369a1")
            .degrees(List.of("BA Journalism","MA Mass Communication","BJMC"))
            .topUniversities(List.of("IIMC Delhi","AJK MCRC Jamia","ACJ Chennai","Symbiosis Pune"))
            .jobOutlook("Moderate").build());

        careers.add(Career.builder().name("Fashion Designer").category("Creative")
            .description("Conceive and design clothing, accessories and textile collections.")
            .skills(List.of("Sketching","Textile Knowledge","Fashion Trends","Pattern Making","CAD","Merchandising"))
            .salaryRange("₹2.5L – ₹25L per year").icon("👗").color("#ec4899")
            .degrees(List.of("B.Des Fashion","Diploma Fashion Design","B.Sc Fashion Technology"))
            .topUniversities(List.of("NID Ahmedabad","NIFT Delhi","Pearl Academy","Symbiosis Pune"))
            .jobOutlook("Moderate").build());

        careers.add(Career.builder().name("Animator").category("Creative")
            .description("Create animated content for films, games, advertisements and streaming platforms.")
            .skills(List.of("Maya","Blender","After Effects","Drawing","Storyboarding","Rigging"))
            .salaryRange("₹2L – ₹20L per year").icon("✏️").color("#7c3aed")
            .degrees(List.of("B.Sc Animation","B.FA Animation","Diploma 3D Animation"))
            .topUniversities(List.of("FTII Pune","Arena Animation","MAAC","NID Ahmedabad"))
            .jobOutlook("Good").build());

        // ── Architecture ──────────────────────────────────────────────────────
        careers.add(Career.builder().name("Architect").category("Architecture")
            .description("Design and plan buildings, public spaces and entire urban environments.")
            .skills(List.of("AutoCAD","Revit","SketchUp","Structural Knowledge","Design Thinking","Client Relations"))
            .salaryRange("₹3L – ₹25L per year").icon("🏠").color("#92400e")
            .degrees(List.of("B.Arch","M.Arch","RIBA"))
            .topUniversities(List.of("SPA Delhi","IIT Roorkee","CEPT Ahmedabad","Rizvi College Mumbai"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Interior Designer").category("Architecture")
            .description("Design functional and aesthetically pleasing indoor spaces for homes and offices.")
            .skills(List.of("AutoCAD","SketchUp","Space Planning","Colour Theory","3D Rendering","Client Management"))
            .salaryRange("₹2.5L – ₹20L per year").icon("🛋️").color("#d97706")
            .degrees(List.of("B.Des Interior Design","Diploma Interior Design","B.Arch"))
            .topUniversities(List.of("NID","NIFT","Pearl Academy Delhi","Rachana Sansad Mumbai"))
            .jobOutlook("Good").build());

        // ── Aviation ──────────────────────────────────────────────────────────
        careers.add(Career.builder().name("Commercial Pilot").category("Aviation")
            .description("Fly commercial passenger and cargo aircraft on domestic and international routes.")
            .skills(List.of("Aviation Theory","Navigation","Instrument Flying","Emergency Procedures","CRM"))
            .salaryRange("₹6L – ₹1Cr+ per year").icon("✈️").color("#0369a1")
            .degrees(List.of("CPL License – DGCA","B.Sc Aviation"))
            .topUniversities(List.of("IGRUA Rae Bareli","Bombay Flying Club","Indira Gandhi Rashtriya Uran Akademi"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Air Traffic Controller").category("Aviation")
            .description("Safely coordinate the movement of aircraft in airspace and at airports.")
            .skills(List.of("Radio Communication","Radar Operation","Multi-tasking","Spatial Awareness","Decision Making"))
            .salaryRange("₹7L – ₹20L per year").icon("🎙️").color("#1d4ed8")
            .degrees(List.of("B.Sc Physics/Mathematics","ATC Training – AAI"))
            .topUniversities(List.of("CATC Allahabad","AAI Training Institute"))
            .jobOutlook("Good").build());

        // ── Science & Research ─────────────────────────────────────────────────
        careers.add(Career.builder().name("Space Scientist (ISRO)").category("Science")
            .description("Work on India's space programs developing satellites, rockets and planetary missions.")
            .skills(List.of("Aerospace Engineering","Orbital Mechanics","Mathematics","Programming","Physics"))
            .salaryRange("₹7L – ₹25L per year").icon("🛸").color("#1d4ed8")
            .degrees(List.of("B.Tech/M.Tech Aerospace/Electronics","M.Sc Physics/Mathematics"))
            .topUniversities(List.of("IIT Bombay","IISc Bangalore","BITS Pilani","IIST Trivandrum"))
            .jobOutlook("Competitive").build());

        careers.add(Career.builder().name("Research Scientist").category("Science")
            .description("Conduct advanced scientific research to push the boundaries of human knowledge.")
            .skills(List.of("Research Methodology","Statistics","Lab Techniques","Scientific Writing","Grant Writing"))
            .salaryRange("₹4L – ₹25L per year").icon("🔭").color("#0891b2")
            .degrees(List.of("M.Sc + PhD in relevant field"))
            .topUniversities(List.of("IISc Bangalore","TIFR Mumbai","CSIR Laboratories","JNU"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Biotechnologist").category("Science")
            .description("Apply biological systems and living organisms to develop new products and technologies.")
            .skills(List.of("Molecular Biology","Genetics","PCR","Bioinformatics","Lab Techniques","Cell Culture"))
            .salaryRange("₹3L – ₹20L per year").icon("🧬").color("#059669")
            .degrees(List.of("B.Sc/B.Tech Biotechnology","M.Sc Biotechnology","PhD"))
            .topUniversities(List.of("IIT Delhi","JNU","Hyderabad Central University","BITS Pilani"))
            .jobOutlook("Good").build());

        careers.add(Career.builder().name("Environmental Scientist").category("Science")
            .description("Study and develop solutions to protect the natural environment and human health.")
            .skills(List.of("Environmental Analysis","GIS","Field Research","Climate Science","Policy Analysis"))
            .salaryRange("₹3L – ₹15L per year").icon("🌿").color("#16a34a")
            .degrees(List.of("B.Sc Environmental Science","M.Sc Environment Management"))
            .topUniversities(List.of("Delhi University","BHU Varanasi","Pune University","TERI Delhi"))
            .jobOutlook("Moderate").build());

        careers.add(Career.builder().name("Forensic Scientist").category("Science")
            .description("Apply scientific methods to analyse physical evidence for criminal investigations.")
            .skills(List.of("Chemistry","Biology","DNA Analysis","Lab Techniques","Report Writing","Crime Scene Analysis"))
            .salaryRange("₹3L – ₹18L per year").icon("🔍").color("#7c3aed")
            .degrees(List.of("B.Sc Forensic Science","M.Sc Forensic Science"))
            .topUniversities(List.of("LNJN NIA Bhopal","Panjab University","Dr. Babasaheb Ambedkar University"))
            .jobOutlook("Growing").build());

        careers.add(Career.builder().name("Neuroscientist").category("Science")
            .description("Study the brain, nervous system and their role in behaviour and cognition.")
            .skills(List.of("Neurobiology","Imaging Techniques","Statistics","Research","Data Analysis"))
            .salaryRange("₹5L – ₹30L per year").icon("🧠").color("#7c3aed")
            .degrees(List.of("MBBS + PhD Neuroscience","M.Sc Neuroscience"))
            .topUniversities(List.of("NIMHANS Bangalore","IISc Bangalore","TIFR Mumbai","AIIMS Delhi"))
            .jobOutlook("Growing").build());

        // ── Education ──────────────────────────────────────────────────────────
        careers.add(Career.builder().name("Professor / Academic").category("Education")
            .description("Teach undergraduate and postgraduate students and conduct world-class research.")
            .skills(List.of("Subject Expertise","Research","Lecture Delivery","Academic Writing","Mentoring","Publishing"))
            .salaryRange("₹4L – ₹20L per year").icon("📚").color("#7c3aed")
            .degrees(List.of("PhD","M.Phil","UGC NET/SET Qualified"))
            .topUniversities(List.of("IITs","IIMs","JNU","Delhi University","Hyderabad University"))
            .jobOutlook("Stable").build());

        // ── Legal ─────────────────────────────────────────────────────────────
        careers.add(Career.builder().name("Lawyer / Advocate").category("Legal")
            .description("Represent clients in courts, provide legal advice and draft legal documents.")
            .skills(List.of("Legal Research","Argumentation","Critical Thinking","Writing","IPC","CPC","Contract Law"))
            .salaryRange("₹3L – ₹1Cr+ per year").icon("⚖️").color("#1e293b")
            .degrees(List.of("LLB","BA LLB","B.Com LLB","LLM"))
            .topUniversities(List.of("NLSIU Bangalore","NLU Delhi","NALSAR Hyderabad","Symbiosis Law School"))
            .jobOutlook("Good").build());

        // ── Hospitality ────────────────────────────────────────────────────────
        careers.add(Career.builder().name("Chef").category("Hospitality")
            .description("Prepare and present meals with creativity and culinary expertise in restaurants and hotels.")
            .skills(List.of("Cooking Techniques","Menu Planning","Food Safety","Kitchen Management","Creativity"))
            .salaryRange("₹2L – ₹20L+ per year").icon("👨‍🍳").color("#ea580c")
            .degrees(List.of("Hotel Management Diploma","Culinary Arts Diploma","B.Sc Hotel Management"))
            .topUniversities(List.of("IHM Mumbai","IHM Pusa Delhi","Oberoi Centre of Learning"))
            .jobOutlook("Good").build());

        // ── Social Work ────────────────────────────────────────────────────────
        careers.add(Career.builder().name("Social Worker").category("Social Work")
            .description("Support individuals, families and communities to improve social well-being.")
            .skills(List.of("Counseling","Community Outreach","Empathy","Communication","Crisis Intervention"))
            .salaryRange("₹2.5L – ₹15L per year").icon("🤝").color("#0891b2")
            .degrees(List.of("BSW","MSW"))
            .topUniversities(List.of("TISS Mumbai","Delhi School of Social Work","Madras School of Social Work"))
            .jobOutlook("Stable").build());

        // ── Wellness ──────────────────────────────────────────────────────────
        careers.add(Career.builder().name("Yoga Instructor").category("Wellness")
            .description("Teach yoga, pranayama, meditation and holistic wellness practices.")
            .skills(List.of("Yoga Asanas","Anatomy","Pranayama","Meditation","Communication","Diet Guidance"))
            .salaryRange("₹2L – ₹20L+ per year").icon("🧘").color("#d97706")
            .degrees(List.of("Yoga Certification – QCI","B.Sc Yoga Science","Diploma Yoga"))
            .topUniversities(List.of("Morarji Desai National Yoga Institute","Bihar School of Yoga","S-VYASA Bangalore"))
            .jobOutlook("Growing").build());

        careerRepository.saveAll(careers);
        System.out.println("✅ Loaded " + careers.size() + " careers into MongoDB");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // COURSES
    // ─────────────────────────────────────────────────────────────────────────
    private void loadCourses() {
        String primaryTeacher = "teacher@demo.com";
        String secondaryTeacher = "teacher2@demo.com";
        List<Career> careers = careerRepository.findAll();
        List<Course> courses = new ArrayList<>();

        // ── Category → YouTube crash-course video ID ──────────────────────────
        Map<String, String> categoryYoutubeId = Map.ofEntries(
            Map.entry("Technology",   "nu_pCVPKzTk"),  // Full Stack Web Dev
            Map.entry("Engineering",  "_uQrJ0TkZlc"),  // CS50 / Engineering intro
            Map.entry("Medicine",     "Rj5GdJLEOvM"),  // NEET Biology crash course
            Map.entry("Government",   "TmdIL5TMpSE"),  // UPSC GS crash course
            Map.entry("Defense",      "TmdIL5TMpSE"),  // UPSC (covers NDA topics)
            Map.entry("Finance",      "l80a8nnolD0"),  // CA Foundation / Finance
            Map.entry("Business",     "rfscVS0vtbw"),  // Python / Business basics
            Map.entry("Creative",     "dKE8SIt9FWc"),  // Graphic Design crash course
            Map.entry("Science",      "b8UKToNp7Fc"),  // CBSE Science crash course
            Map.entry("Architecture", "dKE8SIt9FWc"),  // Design crash course
            Map.entry("Aviation",     "nu_pCVPKzTk"),  // Tech / systems intro
            Map.entry("AI/ML",        "i_LwzRVP7bg"),  // ML with TensorFlow
            Map.entry("Mathematics",  "STPZrR6sR08"),  // JEE Mathematics
            Map.entry("Languages",    "WVr4JNnYsV0"),  // English communication
            Map.entry("Social Work",  "rfscVS0vtbw"),  // Communication basics
            Map.entry("Wellness",     "WVr4JNnYsV0"),  // Communication & wellness
            Map.entry("Legal",        "_uQrJ0TkZlc"),  // General studies
            Map.entry("Hospitality",  "rfscVS0vtbw")   // Business basics
        );

        // ── Category → topic list ─────────────────────────────────────────────
        Map<String, List<String>> categoryTopics = Map.ofEntries(
            Map.entry("Technology", List.of(
                "Core programming fundamentals & data structures",
                "Web / mobile development essentials",
                "Databases, APIs & system design",
                "Version control with Git & GitHub",
                "Cloud deployment & DevOps basics",
                "Interview preparation & resume building"
            )),
            Map.entry("Engineering", List.of(
                "Engineering mathematics & physics",
                "Core domain subject mastery",
                "CAD tools & simulation software",
                "Project planning & report writing",
                "GATE / ESE entrance strategy",
                "Industry internship & placement prep"
            )),
            Map.entry("Medicine", List.of(
                "Biology: Cell biology, genetics & physiology",
                "Chemistry: Organic, inorganic & physical",
                "NEET / AIIMS entrance strategy",
                "Clinical terminology & patient care basics",
                "Previous year question analysis",
                "Mock tests & time management"
            )),
            Map.entry("Government", List.of(
                "Indian History — Ancient, Medieval, Modern",
                "Indian Polity, Constitution & Governance",
                "Indian & World Geography",
                "Economy, Environment & Science",
                "Current Affairs & Editorial Analysis",
                "Answer writing & CSAT preparation"
            )),
            Map.entry("Defense", List.of(
                "General studies & current affairs",
                "Mathematics & reasoning for NDA/CDS",
                "English grammar & comprehension",
                "Physical fitness & SSB interview prep",
                "Personality development & leadership",
                "Previous year papers & mock tests"
            )),
            Map.entry("Finance", List.of(
                "Accounting principles & financial statements",
                "Taxation — Direct & Indirect Tax",
                "Auditing standards & company law",
                "Financial markets & investment analysis",
                "Excel & financial modelling",
                "CA / CFA / CMA exam strategy"
            )),
            Map.entry("Business", List.of(
                "Business strategy & market analysis",
                "Marketing — digital, brand & content",
                "Operations & supply chain management",
                "Entrepreneurship & startup fundamentals",
                "Leadership, negotiation & communication",
                "MBA entrance & case study preparation"
            )),
            Map.entry("Creative", List.of(
                "Design principles — colour, typography, layout",
                "Adobe Photoshop & Illustrator essentials",
                "Brand identity & visual communication",
                "Portfolio building & client management",
                "Social media content creation",
                "Freelancing strategies & pricing"
            )),
            Map.entry("Science", List.of(
                "Physics: Mechanics, optics & electromagnetism",
                "Chemistry: Reactions, bonding & thermodynamics",
                "Biology: Cell biology, genetics & ecology",
                "Research methodology & lab techniques",
                "Scientific writing & publication",
                "Entrance exam strategy (IISc / JEST / JAM)"
            )),
            Map.entry("Architecture", List.of(
                "Architectural history & theory",
                "AutoCAD, Revit & SketchUp",
                "Structural engineering basics",
                "Urban planning & sustainable design",
                "3D rendering & presentation",
                "Portfolio & NATA / JEE Paper 2 prep"
            )),
            Map.entry("Aviation", List.of(
                "Aviation meteorology & navigation",
                "Aircraft systems & airmanship",
                "DGCA ground examination preparation",
                "Radio telephony & ATC procedures",
                "Emergency procedures & CRM",
                "Flight planning & performance"
            )),
            Map.entry("AI/ML", List.of(
                "Python for data science & ML",
                "Machine learning algorithms & evaluation",
                "Deep learning — CNNs, RNNs, Transformers",
                "Natural Language Processing (NLP)",
                "Model deployment with Flask & TF Serving",
                "Research papers & Kaggle competitions"
            )),
            Map.entry("Mathematics", List.of(
                "Calculus — limits, differentiation & integration",
                "Algebra, matrices & complex numbers",
                "Coordinate geometry & vectors",
                "Probability, statistics & combinatorics",
                "Olympiad & competitive problem solving",
                "JEE / CUSAT entrance exam strategy"
            )),
            Map.entry("Languages", List.of(
                "English grammar & vocabulary building",
                "Pronunciation, accent & fluency",
                "Business writing — emails & reports",
                "Public speaking & presentation skills",
                "Group discussion & interview English",
                "Body language & non-verbal communication"
            )),
            Map.entry("Social Work", List.of(
                "Social work theory & ethics",
                "Community development & outreach",
                "Counseling & crisis intervention",
                "NGO management & fundraising",
                "Policy analysis & advocacy",
                "TISS / MSW entrance preparation"
            )),
            Map.entry("Wellness", List.of(
                "Yoga asanas & anatomy",
                "Pranayama & meditation techniques",
                "Nutrition, diet & lifestyle coaching",
                "Stress management & mental health",
                "Teaching methodology & class management",
                "QCI / YCB certification preparation"
            )),
            Map.entry("Legal", List.of(
                "Indian Constitution & fundamental rights",
                "Indian Penal Code (IPC) & CrPC",
                "Contract law & tort law",
                "Corporate law & company act",
                "Legal drafting & court procedures",
                "CLAT / AILET entrance strategy"
            )),
            Map.entry("Hospitality", List.of(
                "Food production & culinary arts",
                "Hotel operations & front office management",
                "Food & beverage service excellence",
                "Housekeeping & accommodation management",
                "Tourism & event management basics",
                "NCHMCT JEE entrance preparation"
            ))
        );

        int idx = 0;
        for (Career career : careers) {
            String level = inferDifficulty(career);
            String duration = inferDuration(career.getCategory(), level);
            double price = inferPrice(career.getCategory(), level);
            double rating = 4.4 + (idx % 6) * 0.1;
            int students = 250 + (idx * 37 % 4200);
            String teacherEmail = (idx % 2 == 0) ? primaryTeacher : secondaryTeacher;
            String teacherName = (idx % 2 == 0) ? "Dr. Priya Sharma" : "Prof. Rajesh Kumar";
            String youtubeId = categoryYoutubeId.getOrDefault(career.getCategory(), "nu_pCVPKzTk");
            List<String> topics = categoryTopics.getOrDefault(career.getCategory(), List.of(
                "Core subject fundamentals",
                "Practical skills & tools",
                "Industry best practices",
                "Entrance exam preparation",
                "Career roadmap & guidance",
                "Mock tests & interview prep"
            ));

            courses.add(makeCourse(
                career.getName() + " Career Prep",
                "Structured roadmap to build skills and prepare for a successful career as " + career.getName() + ".",
                career.getCategory(),
                teacherEmail,
                teacherName,
                level,
                duration,
                price,
                career.getIcon() != null ? career.getIcon() : "📘",
                career.getColor() != null ? career.getColor() : "#3b62f5",
                Math.min(5.0, rating),
                students,
                youtubeId,
                topics
            ));
            idx++;
        }

        // Add a few category masterclasses to comfortably exceed 100.
        courses.add(makeCourse(
            "Technology Interview Masterclass",
            "DSA, system design and real interview preparation for top tech roles.",
            "Technology", primaryTeacher, "Dr. Priya Sharma",
            "Advanced", "12 weeks", 4999.0, "💻", "#3b62f5", 4.9, 1800,
            "nu_pCVPKzTk",
            List.of("Data Structures & Algorithms", "System Design patterns", "LeetCode problem solving",
                     "Behavioural interview techniques", "Resume & LinkedIn optimisation", "Mock interview practice")
        ));
        courses.add(makeCourse(
            "Government Exam Strategy Bootcamp",
            "UPSC and state PSC strategy with current affairs, writing and mock evaluation.",
            "Government", secondaryTeacher, "Prof. Rajesh Kumar",
            "Advanced", "16 weeks", 5999.0, "🏛️", "#d97706", 4.8, 1300,
            "TmdIL5TMpSE",
            List.of("UPSC syllabus breakdown & study plan", "GS Paper 1–4 deep dives", "Essay writing workshop",
                     "Current affairs & editorials", "CSAT Paper 2 strategy", "Full-length mock tests")
        ));
        courses.add(makeCourse(
            "Healthcare Careers Foundation",
            "Core biology, patient care basics and entrance exam pathways for medical careers.",
            "Medicine", primaryTeacher, "Dr. Priya Sharma",
            "Beginner", "10 weeks", 2499.0, "🏥", "#dc2626", 4.7, 1600,
            "Rj5GdJLEOvM",
            List.of("Human anatomy & physiology", "Basic biochemistry & pathology", "NEET entrance strategy",
                     "Clinical terminology essentials", "First aid & patient care basics", "Previous year MCQ practice")
        ));

        courseRepository.saveAll(courses);
        System.out.println("✅ Loaded " + courses.size() + " courses into MongoDB");
    }

    private String inferDifficulty(Career career) {
        String outlook = career.getJobOutlook() != null ? career.getJobOutlook().toLowerCase() : "";
        if (outlook.contains("excellent") || outlook.contains("competitive")) return "Advanced";
        if (outlook.contains("very good") || outlook.contains("good")) return "Intermediate";
        return "Beginner";
    }

    private String inferDuration(String category, String difficulty) {
        if ("Advanced".equals(difficulty)) {
            if ("Government".equalsIgnoreCase(category) || "Defense".equalsIgnoreCase(category)) return "16 weeks";
            return "12 weeks";
        }
        if ("Intermediate".equals(difficulty)) return "10 weeks";
        return "8 weeks";
    }

    private double inferPrice(String category, String difficulty) {
        if ("Beginner".equals(difficulty)) return 1499.0;
        if ("Advanced".equals(difficulty)) {
            if ("Technology".equalsIgnoreCase(category) || "Medicine".equalsIgnoreCase(category)) return 4999.0;
            return 3999.0;
        }
        return 2999.0;
    }

    private Course makeCourse(String title, String description, String category,
            String teacherEmail, String teacher, String difficulty, String duration,
            Double price, String icon, String color, Double rating, Integer students,
            String youtubeId, List<String> topics) {
        Course c = new Course();
        c.setTitle(title);
        c.setDescription(description);
        c.setCareer(category);
        c.setCategory(category);
        c.setTeacherEmail(teacherEmail);
        c.setTeacher(teacher);
        c.setDifficulty(difficulty);
        c.setDuration(duration);
        c.setPrice(price);
        c.setIcon(icon);
        c.setColor(color);
        c.setRating(rating);
        c.setStudents(students);
        c.setYoutubeId(youtubeId);
        c.setTopics(topics);
        c.setEnrolledStudents(new ArrayList<>());
        return c;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DEMO USERS
    // ─────────────────────────────────────────────────────────────────────────
    private void loadDemoUsers() {
        // Demo student
        User student = new User();
        student.setName("Arjun Mehta");
        student.setEmail("student@demo.com");
        student.setPassword(passwordEncoder.encode("password123"));
        student.setRole("STUDENT");
        student.setCity("Mumbai");
        student.setBio("Engineering student passionate about AI and robotics.");
        userRepository.save(student);

        // Demo teacher
        User teacher = new User();
        teacher.setName("Dr. Priya Sharma");
        teacher.setEmail("teacher@demo.com");
        teacher.setPassword(passwordEncoder.encode("password123"));
        teacher.setRole("TEACHER");
        teacher.setSubjects(List.of("Computer Science","Programming","Artificial Intelligence","Machine Learning"));
        teacher.setExperience(8);
        teacher.setHourlyRate(800);
        teacher.setQualification("PhD Computer Science, IIT Delhi");
        teacher.setCity("Delhi");
        teacher.setBio("8 years of teaching experience. Specialise in AI/ML and full-stack development.");
        teacher.setRating(4.9);
        teacher.setTotalRatings(127);
        userRepository.save(teacher);

        // Extra teacher
        User teacher2 = new User();
        teacher2.setName("Prof. Rajesh Kumar");
        teacher2.setEmail("teacher2@demo.com");
        teacher2.setPassword(passwordEncoder.encode("password123"));
        teacher2.setRole("TEACHER");
        teacher2.setSubjects(List.of("Mathematics","Statistics","Physics","Economics"));
        teacher2.setExperience(12);
        teacher2.setHourlyRate(1000);
        teacher2.setQualification("M.Sc Mathematics, Delhi University");
        teacher2.setCity("Delhi");
        teacher2.setBio("12 years of IIT-JEE and UPSC coaching experience.");
        teacher2.setRating(4.7);
        teacher2.setTotalRatings(89);
        userRepository.save(teacher2);

        System.out.println("✅ Demo users created:");
        System.out.println("   Student  → student@demo.com  / password123");
        System.out.println("   Teacher  → teacher@demo.com  / password123");
        System.out.println("   Teacher2 → teacher2@demo.com / password123");
    }
}
