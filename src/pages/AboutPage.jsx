import React from 'react';
import { Book, Edit3, Award, Languages } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container fade-in" style={{ textAlign: 'left', paddingBottom: '80px' }}>
      {/* Editorial Banner */}
      <section className="glass-panel" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.8fr',
        alignItems: 'center',
        padding: '40px',
        margin: '20px 0 48px 0',
        gap: '40px',
        position: 'relative'
      }}>
        <div>
          <img
            src="/kural_about.png"
            alt="KURAL Creative Writing Art"
            style={{
              width: '100%',
              maxHeight: '340px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          />
        </div>

        <div>
          <span style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: 'var(--color-secondary)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <Languages size={16} />
            இருமொழிக் கையேடு / Bilingual Guide
          </span>
          <h1 className="gradient-text" style={{
            fontSize: '3rem',
            lineHeight: 1.15,
            marginBottom: '16px',
            marginTop: 0,
            fontFamily: 'var(--font-heading)'
          }}>
            The Art of Blogging.
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: 0
          }}>
            Explore the dynamics of storytelling, prose, and online journalism. Understand what makes a blog resonate and how you can craft your own signature Kural.
          </p>
        </div>
      </section>

      {/* Grid of Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* Section 1: What is a Blog? */}
        <section>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '12px',
            marginBottom: '24px'
          }}>
            <Book size={24} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>What is a Blog? / வலைப்பதிவு என்றால் என்ன?</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px'
          }}>
            {/* English Card */}
            <div className="glass-panel" style={{ padding: '24px 32px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700 }}>English</span>
              <h3 style={{ fontSize: '1.4rem', margin: '8px 0 16px 0', color: 'var(--text-primary)' }}>A Digital Canvas for Expression</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                A <strong>blog</strong> (short for "weblog") is an online journal or informational website displaying information in reverse chronological order, with the latest posts appearing first. It is a platform where writers share their views on individual subject matters, catalog experiences, or teach skills to an online community.
              </p>
            </div>

            {/* Tamil Card */}
            <div className="glass-panel" style={{ padding: '24px 32px', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-secondary)', fontWeight: 700 }}>தமிழ்</span>
              <h3 style={{ fontSize: '1.4rem', margin: '8px 0 16px 0', color: 'var(--text-primary)' }}>கருத்துக்களைப் பகிரும் டிஜிட்டல் தளம்</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                <strong>வலைப்பதிவு (Blog)</strong> என்பது ஒரு நபர் அல்லது குழுவினர் தங்களின் அனுபவங்கள், சிந்தனைகள், அறிவு மற்றும் கருத்துக்களை இணையத்தில் எழுத்து வடிவமாகப் பகிரும் ஒரு டிஜிட்டல் நாட்குறிப்பாகும். இதில் அண்மைக்காலப் பதிவுகள் முதலில் தோன்றும் வகையில் வரிசைப்படுத்தப்பட்டிருக்கும். இது உலகளவில் மக்களுடன் தொடர்புகொள்ள உதவும் ஒரு சிறந்த ஊடகமாகும்.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: How a blog can be written? */}
        <section>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '12px',
            marginBottom: '24px'
          }}>
            <Edit3 size={24} color="var(--color-secondary)" />
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>How to Write a Blog? / வலைப்பதிவு எழுதுவது எப்படி?</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px'
          }}>
            {/* English Card */}
            <div className="glass-panel" style={{ padding: '24px 32px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700 }}>English</span>
              <h3 style={{ fontSize: '1.4rem', margin: '8px 0 16px 0', color: 'var(--text-primary)' }}>Steps to Craft a Masterpiece</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', paddingLeft: '20px' }}>
                <li><strong>Understand your audience:</strong> Know who you are writing for and what questions they need answered.</li>
                <li><strong>Catchy headline:</strong> Write an attractive title that commands attention.</li>
                <li><strong>Hook introduction:</strong> Start with an engaging fact, quote, or narrative snippet.</li>
                <li><strong>Clear structure:</strong> Break down points using subheadings, paragraphs, and list points.</li>
                <li><strong>Use multimedia:</strong> Supplement your prose with relevant high-quality images.</li>
                <li><strong>Call to Action:</strong> Encourage reader feedback in the replies or community forum.</li>
              </ul>
            </div>

            {/* Tamil Card */}
            <div className="glass-panel" style={{ padding: '24px 32px', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-secondary)', fontWeight: 700 }}>தமிழ்</span>
              <h3 style={{ fontSize: '1.4rem', margin: '8px 0 16px 0', color: 'var(--text-primary)' }}>அற்புதமான பதிவை எழுதுவதற்கான வழிகள்</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', paddingLeft: '20px' }}>
                <li><strong>வாசகர்களைப் புரிந்து கொள்ளுங்கள்:</strong> உங்கள் பதிவை யார் படிக்கப் போகிறார்கள் என்பதை மனதில் வைத்து எழுதுங்கள்.</li>
                <li><strong>கவர்ச்சிகரமான தலைப்பு:</strong> படிப்போரின் கவனத்தை ஈர்க்கும் தலைப்பைத் தேர்ந்தெடுங்கள்.</li>
                <li><strong>சுவாரஸ்யமான அறிமுகம்:</strong> ஒரு நல்ல பழமொழி, கேள்வி அல்லது சிந்தனையுடன் பதிவைத் தொடங்குங்கள்.</li>
                <li><strong>தெளிவான வடிவமைப்பு:</strong> உட்தலைப்புகள், பத்திகள் மற்றும் புள்ளிகளைப் பயன்படுத்தி எளிமையாக விளக்குங்கள்.</li>
                <li><strong>படங்களைச் சேர்க்கவும்:</strong> பதிவிற்குப் பொருத்தமான மற்றும் ஈர்க்கக்கூடிய படங்களைப் பயன்படுத்துங்கள்.</li>
                <li><strong>முடிவுரை:</strong> வாசகர்களின் கருத்துக்களைக் கேட்கும் விதமாகப் பதிவை முடியுங்கள்.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Famous blogs across world */}
        <section>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '12px',
            marginBottom: '24px'
          }}>
            <Award size={24} color="var(--color-accent)" />
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Famous Blogs Across the World / உலகப் புகழ்பெற்ற வலைப்பதிவுகள்</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px'
          }}>
            {/* English Card */}
            <div className="glass-panel" style={{ padding: '24px 32px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700 }}>English</span>
              <h3 style={{ fontSize: '1.4rem', margin: '8px 0 16px 0', color: 'var(--text-primary)' }}>Leading Global Publications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>TechCrunch:</strong> The absolute authority on startup funding, venture capital, and digital innovations.
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Medium:</strong> A massive open publishing platform where journalists, novelists, and developers share insights.
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Smashing Magazine:</strong> An exceptional blog detailing web layout design, typography, UX, and programming.
                </div>
              </div>
            </div>

            {/* Tamil Card */}
            <div className="glass-panel" style={{ padding: '24px 32px', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-secondary)', fontWeight: 700 }}>தமிழ்</span>
              <h3 style={{ fontSize: '1.4rem', margin: '8px 0 16px 0', color: 'var(--text-primary)' }}>பிரபலமான தமிழ் வலைத்தளங்கள்</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>தமிழ் ஹிந்து (Tamil Hindu):</strong> இலக்கியம், அறிவியல், கலை மற்றும் சமூகப் பதிவுகளை வழங்கும் தளம்.
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>வலைப்பகங்கள் (Medium Tamil):</strong> தமிழ் எழுத்தாளர்கள் தங்களின் தனிப்பட்ட கட்டுரைகள் மற்றும் கதைகளைப் பகிரும் பகுதி.
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>தமிழ் டெக் பிளாக்ஸ் (Tamil Tech Blogs):</strong> கணினி, மொபைல் போன்கள் மற்றும் தொழில்நுட்பச் செய்திகளைப் பகிரும் தமிழ் வலைப்பதிவுகள்.
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
