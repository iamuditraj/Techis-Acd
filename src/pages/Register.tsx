import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import logoImg from "../imports/WhatsApp_Image_2026-08-29_at_9.15.10_PM.jpeg";

const COURSES = [
  "Basic Canvas And Basic Designing",
  "Full App Design & Understand AI",
  "Full Interactive Websites & Hosting",
  "Basic Website Structure & Basic Styling",
];

const GRADES = ["Grade 1–3", "Grade 4–5", "Grade 6–8", "Grade 9–10", "Grade 11–12", "College / Other"];

type RegType = "course" | "sports" | "cultural";

type FormData = {
  name: string;
  dob: string;
  gender: string;
  grade: string;
  school: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  parentRelation: string;
  course: string;
  mode: string;
  heard: string;
  message: string;
  regType: RegType;
  sportGender: "Boys" | "Girls" | "";
  sport: string;
  culturalEvent: string;
};

const empty: FormData = {
  name: "", dob: "", gender: "", grade: "", school: "",
  phone: "", email: "", parentName: "", parentPhone: "",
  parentRelation: "", course: "", mode: "", heard: "", message: "",
  regType: "course", sportGender: "", sport: "", culturalEvent: "",
};

const SPORTS_BOYS = ["Cricket", "Football", "Volleyball", "Basketball", "100m Race", "200m Race", "400m Race", "Relay Race", "Shot Put", "Long Jump", "High Jump"];
const SPORTS_GIRLS = ["Cricket", "Football", "Volleyball", "Basketball", "100m Race", "200m Race", "400m Race", "Relay Race", "Shot Put", "Long Jump", "High Jump"];
const CULTURAL_EVENTS = ["Drama", "Dance", "Group Dance", "Singing"];

function CheckIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid #E5E7EB", fontFamily: "Inter, sans-serif",
  fontSize: 14, color: "#071A3D", outline: "none", background: "#FAFAFA",
  transition: "border-color 0.2s",
};

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCourse = searchParams.get("course") || "";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ ...empty, course: preselectedCourse });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTypeChooser, setShowTypeChooser] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (k: keyof FormData, v: any) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateStep = (s: number) => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = "Full name is required";
      if (!form.dob) e.dob = "Date of birth is required";
      if (!form.gender) e.gender = "Please select gender";
      if (!form.grade) e.grade = "Please select grade";
      if (!form.school.trim()) e.school = "School name is required";
    }
    if (s === 2) {
      if (!form.phone.trim()) e.phone = "Phone number is required";
      if (!form.parentName.trim()) e.parentName = "Parent/Guardian name is required";
      if (!form.parentPhone.trim()) e.parentPhone = "Parent phone is required";
    }
    if (s === 3) {
      if (form.regType === "course") {
        if (!form.course) e.course = "Please select a course";
        if (!form.mode) e.mode = "Please select a learning mode";
      } else if (form.regType === "sports") {
        if (!form.sportGender) e.sportGender = "Please select Boys or Girls";
        if (!form.sport) e.sport = "Please select a sport or event";
      } else if (form.regType === "cultural") {
        if (!form.culturalEvent) e.culturalEvent = "Please select a cultural event";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (!validateStep(3)) return;

    const registrationLabel =
      form.regType === "sports"
        ? `Sports – ${form.sportGender}: ${form.sport}`
        : form.regType === "cultural"
        ? `Cultural – ${form.culturalEvent}`
        : form.course;

    const entry = {
      id: Date.now(),
      name: form.name,
      school: form.school,
      course: registrationLabel,
      phone: form.phone,
      email: form.email,
      enrolled: new Date().toISOString().slice(0, 10),
      status: "Pending",
      progress: 0,
      attendance: 0,
      grade: "—",
      parentName: form.parentName,
      parentPhone: form.parentPhone,
      mode: form.regType === "course" ? form.mode : "—",
      gender: form.gender,
      dob: form.dob,
      classGrade: form.grade,
      regType: form.regType,
    };

    const existing = JSON.parse(localStorage.getItem("ta_students") || "[]");
    existing.push(entry);
    localStorage.setItem("ta_students", JSON.stringify(existing));
    setSubmitted(true);
  };

  const steps = ["Personal Info", "Contact Details", "Registration Type", "Review"];

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #071A3D 0%, #123BCE 60%, #6D3CF5 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "48px 40px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 32px 64px rgba(7,26,61,0.3)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #10B981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckIcon />
          </div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#071A3D", marginBottom: 12 }}>Registration Successful! 🎉</h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#4B5563", lineHeight: 1.75, marginBottom: 8 }}>
            Welcome to <strong>Techies Academy</strong>, <strong>{form.name}</strong>!
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 28 }}>
            You've successfully registered for{" "}
            <strong style={{ color: "#2563EB" }}>
              {form.regType === "sports"
                ? `Sports – ${form.sportGender}: ${form.sport}`
                : form.regType === "cultural"
                ? `Cultural – ${form.culturalEvent}`
                : form.course}
            </strong>. Our team will contact you shortly at <strong>{form.phone}</strong> to confirm your enrollment.
          </p>
          <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "14px 18px", border: "1px solid #BBF7D0", marginBottom: 28 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#065F46" }}>📞 For queries, call us at <strong>+91 6201786801</strong></div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#065F46", marginTop: 4 }}>📧 <strong>techiesacademy.edu@gmail.com</strong></div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/")} style={{ background: "linear-gradient(135deg, #123BCE, #2563EB)", color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer" }}>
              Back to Home
            </button>
            <button onClick={() => { setForm(empty); setStep(1); setSubmitted(false); }} style={{ background: "#F3F4F6", color: "#374151", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer" }}>
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FC" }}>

      {/* Top bar */}
      <div style={{ background: "#071A3D", padding: "12px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src={logoImg} alt="Techies Academy" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>Techies Academy</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#94A3B8" }}>Learning you can trust</div>
            </div>
          </div>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 13, padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
            <ArrowLeft /> Back to Site
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>

        {/* Page heading */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)", border: "1px solid #BFDBFE", borderRadius: 100, padding: "5px 16px", marginBottom: 12 }}>
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 12, color: "#2563EB" }}>🎓 STUDENT REGISTRATION • 2026</span>
          </div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "clamp(24px, 4vw, 36px)", color: "#071A3D", lineHeight: 1.2, marginBottom: 10 }}>
            Register at{" "}
            <span style={{ background: "linear-gradient(135deg, #2563EB, #6D3CF5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Techies Academy
            </span>
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#6B7280", maxWidth: 480, margin: "0 auto" }}>
            Fill in your details below to enrol in one of our skill-development courses. Takes just 2 minutes!
          </p>
          {preselectedCourse && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: 10, padding: "8px 18px", marginTop: 16 }}>
              <span style={{ fontSize: 16 }}>✅</span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#065F46" }}>
                Course pre-selected: <strong>{preselectedCourse}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 36, gap: 0 }}>
          {steps.map((label, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: done ? "#10B981" : active ? "linear-gradient(135deg, #123BCE, #2563EB)" : "#E5E7EB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14,
                    color: done || active ? "#fff" : "#9CA3AF",
                    boxShadow: active ? "0 4px 12px rgba(37,99,235,0.35)" : "none",
                    transition: "all 0.3s"
                  }}>
                    {done ? "✓" : num}
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: active ? 600 : 400, color: active ? "#2563EB" : done ? "#10B981" : "#9CA3AF", whiteSpace: "nowrap" }}>{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: "clamp(32px, 6vw, 80px)", height: 2, background: step > num ? "#10B981" : "#E5E7EB", margin: "0 4px 20px", transition: "background 0.3s" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(24px, 4vw, 40px)", border: "1px solid #E5E7EB", boxShadow: "0 8px 32px rgba(7,26,61,0.08)", maxWidth: 680, margin: "0 auto" }}>

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#071A3D", marginBottom: 4 }}>👤 Personal Information</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9CA3AF" }}>Tell us about the student joining Techies Academy.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Student Full Name" required>
                  <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Rahul Sharma" style={inputStyle} />
                  {errors.name && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.name}</div>}
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Date of Birth" required>
                    <input type="date" value={form.dob} onChange={e => set("dob", e.target.value)} style={inputStyle} />
                    {errors.dob && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.dob}</div>}
                  </Field>
                  <Field label="Gender" required>
                    <select value={form.gender} onChange={e => set("gender", e.target.value)} style={inputStyle}>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Prefer not to say</option>
                    </select>
                    {errors.gender && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.gender}</div>}
                  </Field>
                </div>

                <Field label="Current Grade / Class" required>
                  <select value={form.grade} onChange={e => set("grade", e.target.value)} style={inputStyle}>
                    <option value="">Select grade</option>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                  {errors.grade && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.grade}</div>}
                </Field>

                <Field label="School / Institution Name" required>
                  <input value={form.school} onChange={e => set("school", e.target.value)} placeholder="e.g. Delhi Public School" style={inputStyle} />
                  {errors.school && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.school}</div>}
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 2: Contact Details ── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#071A3D", marginBottom: 4 }}>📞 Contact Details</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9CA3AF" }}>We'll use these details to confirm your enrollment.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Student Phone" required>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
                    {errors.phone && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.phone}</div>}
                  </Field>
                  <Field label="Email Address">
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="student@email.com" style={inputStyle} />
                  </Field>
                </div>

                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20 }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 16 }}>👨‍👩‍👧 Parent / Guardian Details</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Field label="Parent / Guardian Name" required>
                      <input value={form.parentName} onChange={e => set("parentName", e.target.value)} placeholder="e.g. Mr. Suresh Sharma" style={inputStyle} />
                      {errors.parentName && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.parentName}</div>}
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <Field label="Parent Phone" required>
                        <input type="tel" value={form.parentPhone} onChange={e => set("parentPhone", e.target.value)} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
                        {errors.parentPhone && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.parentPhone}</div>}
                      </Field>
                      <Field label="Relation to Student">
                        <select value={form.parentRelation} onChange={e => set("parentRelation", e.target.value)} style={inputStyle}>
                          <option value="">Select relation</option>
                          <option>Father</option>
                          <option>Mother</option>
                          <option>Guardian</option>
                          <option>Other</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Registration Type ── */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#071A3D", marginBottom: 4 }}>📋 Registration Type</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9CA3AF" }}>Choose what you want to register for. Course registration is selected by default.</p>
              </div>

              {/* Current type badge + Change button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: form.regType === "course" ? "#EFF6FF" : form.regType === "sports" ? "#F0FDF4" : "#FDF4FF", border: `1.5px solid ${form.regType === "course" ? "#BFDBFE" : form.regType === "sports" ? "#BBF7D0" : "#E9D5FF"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{form.regType === "course" ? "📚" : form.regType === "sports" ? "🏅" : "🎭"}</span>
                  <div>
                    <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#071A3D" }}>
                      {form.regType === "course" ? "Course Registration" : form.regType === "sports" ? "Sports Registration" : "Cultural Registration"}
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6B7280", marginTop: 1 }}>
                      {form.regType === "course" ? "Enrol in a skill-development course" : form.regType === "sports" ? "Register for sports events & competitions" : "Register for cultural events & performances"}
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowTypeChooser(v => !v)} style={{ background: "#fff", border: "1.5px solid #D1D5DB", color: "#374151", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 12, padding: "7px 14px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {showTypeChooser ? "✕ Close" : "⇄ Change"}
                </button>
              </div>

              {/* Type chooser panel */}
              {showTypeChooser && (
                <div style={{ background: "#F8FAFC", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: 16, marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 4 }}>Select Registration Type</div>
                  {([
                    { key: "course", label: "Course Registration", desc: "Skill-development IT courses", emoji: "📚", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
                    { key: "sports", label: "Sports Registration", desc: "Cricket, Football, Athletics & more", emoji: "🏅", color: "#059669", bg: "#F0FDF4", border: "#BBF7D0" },
                    { key: "cultural", label: "Cultural Registration", desc: "Drama, Dance, Singing & more", emoji: "🎭", color: "#7C3AED", bg: "#FDF4FF", border: "#E9D5FF" },
                  ] as const).map(opt => (
                    <div key={opt.key} onClick={() => { set("regType", opt.key); setShowTypeChooser(false); set("sport", ""); set("sportGender", ""); set("culturalEvent", ""); }} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                      border: `2px solid ${form.regType === opt.key ? opt.border : "#E5E7EB"}`,
                      background: form.regType === opt.key ? opt.bg : "#fff", transition: "all 0.2s"
                    }}>
                      <span style={{ fontSize: 24 }}>{opt.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: form.regType === opt.key ? opt.color : "#071A3D" }}>{opt.label}</div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6B7280" }}>{opt.desc}</div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${form.regType === opt.key ? opt.color : "#D1D5DB"}`, background: form.regType === opt.key ? opt.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {form.regType === opt.key && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Course section ── */}
              {form.regType === "course" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <Field label="Select a Course" required>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                      {[
                        { name: "Basic Canvas And Basic Designing", duration: "2 Months", level: "Beginner", emoji: "🎨" },
                        { name: "Full App Design & Understand AI", duration: "2 Months", level: "Intermediate", emoji: "📱" },
                        { name: "Full Interactive Websites & Hosting", duration: "2 Months", level: "Beginner–Advanced", emoji: "🌐" },
                        { name: "Basic Website Structure & Basic Styling", duration: "2 Months", level: "Beginner", emoji: "💻" },
                      ].map(c => (
                        <div key={c.name} onClick={() => set("course", c.name)} style={{
                          display: "flex", alignItems: "center", gap: 14,
                          padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                          border: `2px solid ${form.course === c.name ? "#2563EB" : "#E5E7EB"}`,
                          background: form.course === c.name ? "#EFF6FF" : "#FAFAFA",
                          transition: "all 0.2s"
                        }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: form.course === c.name ? "#DBEAFE" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.emoji}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#071A3D" }}>{c.name}</div>
                            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6B7280", marginTop: 2 }}>⏱ {c.duration} &nbsp;•&nbsp; 📊 {c.level}</div>
                          </div>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${form.course === c.name ? "#2563EB" : "#D1D5DB"}`, background: form.course === c.name ? "#2563EB" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {form.course === c.name && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.course && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 6 }}>{errors.course}</div>}
                  </Field>

                  <Field label="Preferred Learning Mode" required>
                    <div style={{ display: "flex", gap: 12 }}>
                      {["Online", "Offline", "Hybrid (Both)"].map(m => (
                        <div key={m} onClick={() => set("mode", m)} style={{
                          flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                          border: `2px solid ${form.mode === m ? "#2563EB" : "#E5E7EB"}`,
                          background: form.mode === m ? "#EFF6FF" : "#FAFAFA",
                          fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 12,
                          color: form.mode === m ? "#2563EB" : "#374151", transition: "all 0.2s"
                        }}>{m}</div>
                      ))}
                    </div>
                    {errors.mode && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 6 }}>{errors.mode}</div>}
                  </Field>

                  <Field label="How did you hear about us?">
                    <select value={form.heard} onChange={e => set("heard", e.target.value)} style={inputStyle}>
                      <option value="">Select an option</option>
                      <option>Friend / Family</option>
                      <option>School Recommendation</option>
                      <option>Social Media</option>
                      <option>Google Search</option>
                      <option>Flyer / Advertisement</option>
                      <option>Other</option>
                    </select>
                  </Field>

                  <Field label="Additional Message (Optional)">
                    <textarea value={form.message} onChange={e => set("message", e.target.value)} placeholder="Any questions or special requirements..." rows={3}
                      style={{ ...inputStyle, resize: "vertical" }} />
                  </Field>
                </div>
              )}

              {/* ── Sports section ── */}
              {form.regType === "sports" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Boys / Girls tabs */}
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>
                      Select Category <span style={{ color: "#EF4444" }}>*</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      {(["Boys", "Girls"] as const).map(g => (
                        <div key={g} onClick={() => { set("sportGender", g); set("sport", ""); }} style={{
                          flex: 1, padding: "14px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                          border: `2px solid ${form.sportGender === g ? "#059669" : "#E5E7EB"}`,
                          background: form.sportGender === g ? "#F0FDF4" : "#FAFAFA", transition: "all 0.2s"
                        }}>
                          <div style={{ fontSize: 26, marginBottom: 4 }}>{g === "Boys" ? "👦" : "👧"}</div>
                          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: form.sportGender === g ? "#059669" : "#374151" }}>{g}</div>
                        </div>
                      ))}
                    </div>
                    {errors.sportGender && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 6 }}>{errors.sportGender}</div>}
                  </div>

                  {/* Sport list */}
                  {form.sportGender && (
                    <div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>
                        Select Sport / Event <span style={{ color: "#EF4444" }}>*</span>
                      </div>

                      {/* Team sports */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 11, color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>⚽ Team Sports</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {["Cricket", "Football", "Volleyball", "Basketball"].map(s => (
                            <div key={s} onClick={() => set("sport", s)} style={{
                              display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                              border: `2px solid ${form.sport === s ? "#059669" : "#E5E7EB"}`,
                              background: form.sport === s ? "#F0FDF4" : "#FAFAFA", transition: "all 0.2s"
                            }}>
                              <span style={{ fontSize: 18 }}>
                                {s === "Cricket" ? "🏏" : s === "Football" ? "⚽" : s === "Volleyball" ? "🏐" : "🏀"}
                              </span>
                              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 12, color: form.sport === s ? "#059669" : "#374151" }}>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Track events */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 11, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>🏃 Track Events</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {["100m Race", "200m Race", "400m Race", "Relay Race"].map(s => (
                            <div key={s} onClick={() => set("sport", s)} style={{
                              display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                              border: `2px solid ${form.sport === s ? "#2563EB" : "#E5E7EB"}`,
                              background: form.sport === s ? "#EFF6FF" : "#FAFAFA", transition: "all 0.2s"
                            }}>
                              <span style={{ fontSize: 18 }}>🏃</span>
                              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 12, color: form.sport === s ? "#2563EB" : "#374151" }}>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Field events */}
                      <div>
                        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 11, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>🥇 Field Events</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                          {["Shot Put", "Long Jump", "High Jump"].map(s => (
                            <div key={s} onClick={() => set("sport", s)} style={{
                              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "11px 8px", borderRadius: 10, cursor: "pointer",
                              border: `2px solid ${form.sport === s ? "#DC2626" : "#E5E7EB"}`,
                              background: form.sport === s ? "#FEF2F2" : "#FAFAFA", transition: "all 0.2s"
                            }}>
                              <span style={{ fontSize: 22 }}>
                                {s === "Shot Put" ? "🎯" : s === "Long Jump" ? "🦘" : "🏆"}
                              </span>
                              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 11, color: form.sport === s ? "#DC2626" : "#374151", textAlign: "center" }}>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {errors.sport && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 8 }}>{errors.sport}</div>}
                    </div>
                  )}

                  {/* Selected summary */}
                  {form.sportGender && form.sport && (
                    <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>✅</span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#065F46" }}>
                        {form.sportGender} – {form.sport}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ── Cultural section ── */}
              {form.regType === "cultural" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>
                      Select Cultural Event <span style={{ color: "#EF4444" }}>*</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { name: "Drama", emoji: "🎭", desc: "Stage play & acting" },
                        { name: "Dance", emoji: "💃", desc: "Solo dance performance" },
                        { name: "Group Dance", emoji: "🕺", desc: "Group choreography" },
                        { name: "Singing", emoji: "🎤", desc: "Solo / group singing" },
                      ].map(e => (
                        <div key={e.name} onClick={() => set("culturalEvent", e.name)} style={{
                          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                          padding: "18px 12px", borderRadius: 14, cursor: "pointer",
                          border: `2px solid ${form.culturalEvent === e.name ? "#7C3AED" : "#E5E7EB"}`,
                          background: form.culturalEvent === e.name ? "#F5F3FF" : "#FAFAFA",
                          transition: "all 0.2s"
                        }}>
                          <span style={{ fontSize: 36, marginBottom: 8 }}>{e.emoji}</span>
                          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: form.culturalEvent === e.name ? "#7C3AED" : "#071A3D" }}>{e.name}</div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>{e.desc}</div>
                        </div>
                      ))}
                    </div>
                    {errors.culturalEvent && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#EF4444", marginTop: 8 }}>{errors.culturalEvent}</div>}
                  </div>

                  {form.culturalEvent && (
                    <div style={{ background: "#F5F3FF", border: "1.5px solid #E9D5FF", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>✅</span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 13, color: "#6D28D9" }}>
                        {form.culturalEvent} selected
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#071A3D", marginBottom: 4 }}>✅ Review & Submit</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9CA3AF" }}>Please review your details before submitting.</p>
              </div>

              {[
                {
                  heading: "👤 Personal Information",
                  rows: [
                    ["Full Name", form.name],
                    ["Date of Birth", form.dob],
                    ["Gender", form.gender],
                    ["Grade / Class", form.grade],
                    ["School", form.school],
                  ]
                },
                {
                  heading: "📞 Contact Details",
                  rows: [
                    ["Student Phone", form.phone],
                    ["Email", form.email || "—"],
                    ["Parent / Guardian", form.parentName],
                    ["Parent Phone", form.parentPhone],
                    ["Relation", form.parentRelation || "—"],
                  ]
                },
                form.regType === "course"
                  ? {
                    heading: "📚 Course Details",
                    rows: [
                      ["Registration Type", "Course Registration"],
                      ["Selected Course", form.course],
                      ["Learning Mode", form.mode],
                      ["Heard About Us", form.heard || "—"],
                    ]
                  }
                  : form.regType === "sports"
                  ? {
                    heading: "🏅 Sports Details",
                    rows: [
                      ["Registration Type", "Sports Registration"],
                      ["Category", form.sportGender],
                      ["Sport / Event", form.sport],
                    ]
                  }
                  : {
                    heading: "🎭 Cultural Details",
                    rows: [
                      ["Registration Type", "Cultural Registration"],
                      ["Event", form.culturalEvent],
                    ]
                  },
              ].map(section => (
                <div key={section.heading} style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#2563EB", marginBottom: 10 }}>{section.heading}</div>
                  <div style={{ background: "#F8FAFC", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
                    {section.rows.map(([k, v], i) => (
                      <div key={k} style={{ display: "flex", gap: 12, padding: "10px 16px", borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9CA3AF", width: 130, flexShrink: 0 }}>{k}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#071A3D", fontWeight: 600, flex: 1 }}>{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ background: "#FFFBEB", borderRadius: 12, padding: "12px 16px", border: "1px solid #FDE68A", marginTop: 4 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#92400E" }}>
                  📋 By submitting this form, you confirm that all the details provided are accurate. Our team will contact you within 24 hours to confirm your enrollment.
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 20, borderTop: "1px solid #F3F4F6" }}>
            {step > 1 ? (
              <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F3F4F6", border: "none", color: "#374151", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, padding: "12px 20px", borderRadius: 10, cursor: "pointer" }}>
                <ArrowLeft /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button onClick={next} style={{ background: "linear-gradient(135deg, #123BCE, #2563EB)", color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg, #059669, #10B981)", color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}>
                ✓ Submit Registration
              </button>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
          {["🔒 Secure & Private", "✅ Trusted by Schools", "📞 24hr Support"].map(b => (
            <span key={b} style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9CA3AF" }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
