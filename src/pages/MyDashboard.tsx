import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import logoImg from "../imports/WhatsApp_Image_2026-08-29_at_9.15.10_PM.jpeg";

type Student = {
  id: number; name: string; school: string; course: string;
  phone: string; email: string; enrolled: string;
  status: string; progress: number; attendance: number; grade: string;
};

const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "Riya Sharma", school: "St. Mary's School", course: "Basic Canvas And Basic Designing", phone: "+91 98001 11001", email: "riya@email.com", enrolled: "2026-07-01", status: "Active", progress: 80, attendance: 92, grade: "A" },
  { id: 2, name: "Arjun Mehta", school: "Delhi Public School", course: "Full Interactive Websites & Hosting", phone: "+91 98001 11002", email: "arjun@email.com", enrolled: "2026-07-05", status: "Active", progress: 60, attendance: 85, grade: "B+" },
  { id: 3, name: "Priya Nair", school: "Kendriya Vidyalaya", course: "Full App Design & Understand AI", phone: "+91 98001 11003", email: "priya@email.com", enrolled: "2026-06-15", status: "Completed", progress: 100, attendance: 97, grade: "A+" },
  { id: 4, name: "Siddharth Roy", school: "St. Xavier's", course: "Basic Website Structure & Basic Styling", phone: "+91 98001 11004", email: "sid@email.com", enrolled: "2026-08-01", status: "Pending", progress: 10, attendance: 60, grade: "—" },
  { id: 5, name: "Ananya Patel", school: "Ryan International", course: "Basic Canvas And Basic Designing", phone: "+91 98001 11005", email: "ananya@email.com", enrolled: "2026-07-10", status: "Active", progress: 55, attendance: 88, grade: "B" },
  { id: 6, name: "Karan Singh", school: "DAV School", course: "Full Interactive Websites & Hosting", phone: "+91 98001 11006", email: "karan@email.com", enrolled: "2026-05-20", status: "Completed", progress: 100, attendance: 95, grade: "A" },
  { id: 7, name: "Deepika Rao", school: "Modern School", course: "Full App Design & Understand AI", phone: "+91 98001 11007", email: "deepika@email.com", enrolled: "2026-08-12", status: "Active", progress: 35, attendance: 78, grade: "B-" },
  { id: 8, name: "Vikram Joshi", school: "Army School", course: "Basic Website Structure & Basic Styling", phone: "+91 98001 11008", email: "vikram@email.com", enrolled: "2026-07-25", status: "Inactive", progress: 20, attendance: 40, grade: "—" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active:    { bg: "#D1FAE5", text: "#065F46" },
  Completed: { bg: "#DBEAFE", text: "#1D4ED8" },
  Inactive:  { bg: "#FEE2E2", text: "#991B1B" },
  Pending:   { bg: "#FEF3C7", text: "#92400E" },
};

function ProgressRing({ value, color, size = 90 }: { value: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
}

function getAllStudents(): Student[] {
  try {
    const stored = JSON.parse(localStorage.getItem("ta_students") || "[]");
    return [...INITIAL_STUDENTS, ...stored];
  } catch { return INITIAL_STUDENTS; }
}

export default function MyDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    try {
      const session = JSON.parse(localStorage.getItem("ta_session") || "null");
      if (!session || session.role !== "student") { navigate("/login"); return; }
      const all = getAllStudents();
      const found = all.find(s => s.id === session.studentId);
      if (found) setStudent(found);
      else setNotFound(true);
    } catch { navigate("/login"); }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ta_session");
    navigate("/login");
  };

  if (notFound) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "Poppins, sans-serif", background: "#F1F5F9" }}>
      <div style={{ fontSize: 48 }}>😕</div>
      <h2 style={{ color: "#071A3D" }}>Student record not found</h2>
      <button onClick={() => navigate("/login")} style={{ background: "#2563EB", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Back to Login</button>
    </div>
  );

  if (!student) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F1F5F9" }}>
      <div style={{ fontFamily: "Inter, sans-serif", color: "#9CA3AF", fontSize: 14 }}>Loading your dashboard...</div>
    </div>
  );

  const statusColor = STATUS_COLORS[student.status] || STATUS_COLORS["Pending"];
  const gradeColor = student.grade === "A+" ? "#6D3CF5" : student.grade === "A" ? "#2563EB" : student.grade.startsWith("B") ? "#10B981" : "#6B7280";

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: "#071A3D", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={logoImg} alt="Logo" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.2)" }} />
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>Techies Academy</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Logged in as <strong style={{ color: "#fff" }}>{student.name}</strong></div>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 12, padding: "7px 14px", borderRadius: 8, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Hero card */}
        <div style={{ background: "linear-gradient(135deg, #071A3D 0%, #2563EB 100%)", borderRadius: 24, padding: "clamp(28px, 4vw, 44px)", marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `hsl(${student.id * 60}, 60%, 65%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 28, color: "#fff", flexShrink: 0, border: "3px solid rgba(255,255,255,0.3)" }}>
              {student.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "clamp(18px, 3vw, 26px)", color: "#fff", marginBottom: 4 }}>Welcome, {student.name.split(" ")[0]}! 👋</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>{student.school}</div>
              <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "4px 14px", borderRadius: 99, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600 }}>
                {student.status}
              </span>
            </div>
          </div>
        </div>

        {/* Progress rings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="my-grid">
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(7,26,61,0.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: "#071A3D" }}>Course Progress</div>
            <div style={{ position: "relative" }}>
              <ProgressRing value={student.progress} color="#2563EB" size={96} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 18, color: "#2563EB" }}>{student.progress}%</div>
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
              {student.progress === 100 ? "🎉 Course Completed!" : `${100 - student.progress}% remaining`}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(7,26,61,0.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: "#071A3D" }}>Attendance</div>
            <div style={{ position: "relative" }}>
              <ProgressRing value={student.attendance} color={student.attendance >= 75 ? "#10B981" : "#EF4444"} size={96} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 18, color: student.attendance >= 75 ? "#10B981" : "#EF4444" }}>{student.attendance}%</div>
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: student.attendance < 75 ? "#EF4444" : "#9CA3AF", textAlign: "center" }}>
              {student.attendance < 75 ? "⚠️ Below 75% — improve attendance" : "✅ Good attendance"}
            </div>
          </div>
        </div>

        {/* Course card */}
        <div style={{ background: "#EFF6FF", borderRadius: 20, padding: "20px 24px", border: "1px solid #BFDBFE", marginBottom: 20, display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📚</div>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#6B7280", letterSpacing: "0.05em", marginBottom: 4 }}>ENROLLED COURSE</div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#1D4ED8" }}>{student.course}</div>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }} className="my-grid">
          {[
            { icon: "🏆", label: "Current Grade", value: student.grade === "—" ? "Not graded yet" : student.grade, color: gradeColor },
            { icon: "📅", label: "Enrolled On", value: student.enrolled, color: "#374151" },
            { icon: "📞", label: "Phone", value: student.phone, color: "#374151" },
            { icon: "✉️", label: "Email", value: student.email || "Not provided", color: "#374151" },
          ].map(item => (
            <div key={item.label} style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(7,26,61,0.05)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#9CA3AF", letterSpacing: "0.04em" }}>{item.label.toUpperCase()}</div>
              </div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Status card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(7,26,61,0.06)", marginBottom: 24 }}>
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#071A3D", marginBottom: 16 }}>📊 Your Learning Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "Status", value: student.status, bg: statusColor.bg, color: statusColor.text },
              { label: "Progress", value: `${student.progress}%`, bg: "#EFF6FF", color: "#1D4ED8" },
              { label: "Attendance", value: `${student.attendance}%`, bg: student.attendance >= 75 ? "#ECFDF5" : "#FEF2F2", color: student.attendance >= 75 ? "#065F46" : "#DC2626" },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "14px", textAlign: "center" }}>
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 20, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6B7280", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Need help */}
        <div style={{ background: "linear-gradient(135deg, #071A3D 0%, #1E3A6E 100%)", borderRadius: 20, padding: "24px 28px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>Need help or have a question?</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Contact your instructor at Techies Academy anytime.</div>
            <div style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>📞 +91 6201786801</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>✉️ techiesacademy.edu@gmail.com</span>
            </div>
          </div>
          <button onClick={() => navigate("/")} style={{ background: "#F59E0B", color: "#071A3D", fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, padding: "12px 20px", borderRadius: 12, border: "none", cursor: "pointer", flexShrink: 0 }}>
            Back to Home →
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 540px) {
          .my-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
