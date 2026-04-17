package com.careerpath.backend.controller;

import com.careerpath.backend.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final TeacherService teacherService;

    private static final List<Map<String, Object>> SUBJECTS = List.of(
        Map.of("id", 1, "name", "Mathematics", "icon", "📐", "color", "#3b62f5",
            "description", "Algebra, Calculus, Trigonometry, Statistics, and more",
            "topics", List.of("Algebra","Calculus","Trigonometry","Statistics","Linear Algebra")),
        Map.of("id", 2, "name", "Physics", "icon", "⚛️", "color", "#7c3aed",
            "description", "Mechanics, Thermodynamics, Electromagnetism, and Quantum Physics",
            "topics", List.of("Mechanics","Thermodynamics","Electromagnetism","Optics","Quantum Physics")),
        Map.of("id", 3, "name", "Chemistry", "icon", "🧪", "color", "#059669",
            "description", "Organic, Inorganic, Physical Chemistry and Biochemistry",
            "topics", List.of("Organic Chemistry","Inorganic Chemistry","Physical Chemistry","Biochemistry")),
        Map.of("id", 4, "name", "Biology", "icon", "🧬", "color", "#16a34a",
            "description", "Cell Biology, Genetics, Ecology, and Human Physiology",
            "topics", List.of("Cell Biology","Genetics","Ecology","Human Physiology","Microbiology")),
        Map.of("id", 5, "name", "Computer Science", "icon", "💻", "color", "#1d4ed8",
            "description", "Programming, Algorithms, Data Structures, and Software Development",
            "topics", List.of("Data Structures","Algorithms","Operating Systems","Database","Networks")),
        Map.of("id", 6, "name", "Programming", "icon", "👨‍💻", "color", "#0891b2",
            "description", "Python, Java, C++, JavaScript and Web Development",
            "topics", List.of("Python","Java","C++","JavaScript","React","Node.js")),
        Map.of("id", 7, "name", "English", "icon", "📝", "color", "#ea580c",
            "description", "Grammar, Literature, Writing, and Communication Skills",
            "topics", List.of("Grammar","Comprehension","Essay Writing","Literature","Communication")),
        Map.of("id", 8, "name", "History", "icon", "📜", "color", "#92400e",
            "description", "Indian History, World History, and Civics",
            "topics", List.of("Ancient India","Medieval India","Modern India","World History","Civics")),
        Map.of("id", 9, "name", "Geography", "icon", "🌏", "color", "#0369a1",
            "description", "Physical, Human, and Indian Geography",
            "topics", List.of("Physical Geography","Human Geography","Cartography","Indian Geography")),
        Map.of("id", 10, "name", "Economics", "icon", "📈", "color", "#d97706",
            "description", "Micro and Macroeconomics, Indian Economy, and Finance",
            "topics", List.of("Microeconomics","Macroeconomics","Indian Economy","International Trade")),
        Map.of("id", 11, "name", "Business Studies", "icon", "💼", "color", "#7c3aed",
            "description", "Management, Marketing, Finance, and Entrepreneurship",
            "topics", List.of("Management","Marketing","Finance","Entrepreneurship","Business Law")),
        Map.of("id", 12, "name", "Political Science", "icon", "🏛️", "color", "#1e293b",
            "description", "Indian Polity, International Relations, and Political Theory",
            "topics", List.of("Indian Polity","Constitutional Law","International Relations")),
        Map.of("id", 13, "name", "Psychology", "icon", "🧠", "color", "#8b5cf6",
            "description", "Cognitive Psychology, Counseling, and Human Behavior",
            "topics", List.of("Cognitive Psychology","Developmental Psychology","Social Psychology")),
        Map.of("id", 14, "name", "Statistics", "icon", "📊", "color", "#0891b2",
            "description", "Probability, Statistical Inference, and Data Analysis",
            "topics", List.of("Probability","Inferential Statistics","Regression","Time Series")),
        Map.of("id", 15, "name", "Artificial Intelligence", "icon", "🤖", "color", "#7c3aed",
            "description", "Machine Learning, Deep Learning, NLP, and Computer Vision",
            "topics", List.of("Machine Learning","Deep Learning","NLP","Computer Vision")),
        Map.of("id", 16, "name", "Machine Learning", "icon", "🧠", "color", "#4f46e5",
            "description", "Supervised Learning, Neural Networks, and Practical ML Applications",
            "topics", List.of("Supervised Learning","Unsupervised Learning","Neural Networks")),
        Map.of("id", 17, "name", "Cybersecurity", "icon", "🔒", "color", "#dc2626",
            "description", "Network Security, Ethical Hacking, Cryptography, and Incident Response",
            "topics", List.of("Network Security","Ethical Hacking","Cryptography","VAPT")),
        Map.of("id", 18, "name", "Robotics", "icon", "🦾", "color", "#d97706",
            "description", "Robot Programming, Control Systems, and Automation",
            "topics", List.of("ROS","Control Systems","Computer Vision","Arduino")),
        Map.of("id", 19, "name", "Astronomy", "icon", "🌟", "color", "#1e293b",
            "description", "Astrophysics, Cosmology, and Observational Astronomy",
            "topics", List.of("Astrophysics","Cosmology","Stellar Physics","Planetary Science")),
        Map.of("id", 20, "name", "Environmental Science", "icon", "🌿", "color", "#16a34a",
            "description", "Ecology, Climate Change, and Sustainable Development",
            "topics", List.of("Ecology","Climate Change","Pollution Control","Biodiversity"))
    );

    @GetMapping
    public ResponseEntity<?> getAllSubjects() {
        return ResponseEntity.ok(SUBJECTS);
    }

    @GetMapping("/{subject}/teachers")
    public ResponseEntity<?> getTeachersBySubject(@PathVariable String subject) {
        return ResponseEntity.ok(teacherService.getTeachersBySubject(subject));
    }
}
