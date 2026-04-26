export default function PrivacyPage() {
  const lastUpdated = "April 23, 2025";
  const contactEmail = "youngmanblueprint@outlook.com";
  const appName = "YoungmanBlueprint";

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F7" }}>
      <div className="mx-auto max-w-2xl px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9963B", fontWeight: 600, marginBottom: 8 }}>
            {appName}
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, color: "#0D0D0D", lineHeight: 1.2 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>Last updated: {lastUpdated}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          <Section title="Overview">
            <P>
              {appName} ("we", "our", "the app") is a personal self-improvement tool. We take your
              privacy seriously. This policy explains what data we collect, why we collect it, how it
              is stored, and your rights over it.
            </P>
            <P>
              By using {appName} you agree to this policy. If you do not agree, please stop using the
              app and delete your account.
            </P>
          </Section>

          <Section title="What Data We Collect">
            <P>We collect only what is necessary to run the app:</P>
            <ul style={{ paddingLeft: 20, color: "#444", fontSize: 15, lineHeight: 1.8 }}>
              <li><strong>Account data:</strong> your email address (used to create and access your account).</li>
              <li><strong>Profile data:</strong> name, age, occupation, relationship status, and location — entered voluntarily during onboarding.</li>
              <li><strong>App usage data:</strong> habits logged, journal entries, goals, body metrics, XP, streaks, pillar check-in scores, and workbook responses.</li>
              <li><strong>Device data:</strong> notification preferences (stored locally on your device).</li>
            </ul>
            <P>We do not collect IP addresses, advertising identifiers, precise location, or any data you have not explicitly entered into the app.</P>
          </Section>

          <Section title="How We Use Your Data">
            <P>Your data is used solely to power the app experience:</P>
            <ul style={{ paddingLeft: 20, color: "#444", fontSize: 15, lineHeight: 1.8 }}>
              <li>To sync your progress across devices via your account.</li>
              <li>To display your stats, streaks, XP, and pillar scores.</li>
              <li>To send daily habit reminders (only if you enable notifications).</li>
            </ul>
            <P>
              We do <strong>not</strong> sell your data. We do <strong>not</strong> use your data for
              advertising. We do <strong>not</strong> share your data with third parties except as
              described below.
            </P>
          </Section>

          <Section title="Data Storage & Third Parties">
            <P>
              Your account and app data is stored securely in <strong>Supabase</strong> (supabase.com),
              a cloud database provider. Supabase stores data in servers located in the United States.
              Supabase is SOC 2 compliant and encrypts data in transit (TLS) and at rest.
            </P>
            <P>
              Row-level security is enforced on our database — meaning your data can only be accessed
              by you when you are signed in. No other user or staff member can read your personal
              entries.
            </P>
            <P>
              Notification preferences are stored on your device only and are never sent to our servers.
            </P>
          </Section>

          <Section title="Data Retention">
            <P>
              We retain your data for as long as your account is active. If you delete your account,
              all associated data (profile, habits, journal entries, goals, metrics) is permanently
              deleted from our database within 30 days. This cannot be undone.
            </P>
            <P>
              You can delete your account at any time from the app: <strong>Profile → Delete Account</strong>.
            </P>
          </Section>

          <Section title="Children's Privacy">
            <P>
              {appName} is not directed at children under the age of 13. We do not knowingly collect
              personal information from children under 13. If you believe a child has provided us with
              personal information, please contact us and we will delete it promptly.
            </P>
          </Section>

          <Section title="Your Rights">
            <P>You have the right to:</P>
            <ul style={{ paddingLeft: 20, color: "#444", fontSize: 15, lineHeight: 1.8 }}>
              <li><strong>Access</strong> the data we hold about you (it is all visible inside the app).</li>
              <li><strong>Correct</strong> your data at any time via Profile → Edit.</li>
              <li><strong>Delete</strong> your data and account at any time via Profile → Delete Account.</li>
              <li><strong>Export</strong> a copy of your data — contact us at the email below.</li>
            </ul>
            <P>
              If you are in the EU/EEA, you also have rights under GDPR including the right to lodge a
              complaint with your local supervisory authority.
            </P>
          </Section>

          <Section title="Push Notifications">
            <P>
              If you enable daily reminders, {appName} will send local notifications to your device at
              your chosen time. These notifications are scheduled entirely on your device — no data is
              sent to our servers to deliver them. You can disable notifications at any time in the app
              or in your device settings.
            </P>
          </Section>

          <Section title="Changes to This Policy">
            <P>
              We may update this policy from time to time. If we make significant changes we will update
              the "Last updated" date at the top of this page. Continued use of the app after changes
              are posted constitutes acceptance of the updated policy.
            </P>
          </Section>

          <Section title="Contact">
            <P>
              Questions, data requests, or concerns? Email us at:
            </P>
            <a
              href={`mailto:${contactEmail}`}
              style={{ color: "#C9963B", fontWeight: 600, fontSize: 15 }}
            >
              {contactEmail}
            </a>
          </Section>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #E8E8E8", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#AAAAAA" }}>© {new Date().getFullYear()} {appName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#0D0D0D", marginBottom: 12 }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75 }}>
      {children}
    </p>
  );
}
