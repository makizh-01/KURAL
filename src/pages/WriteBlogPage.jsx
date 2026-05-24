import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Mic, MicOff, Image, Upload, FileText, Globe, Send, Save, ArrowLeft, Sparkles, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

// Available Languages for Dictation
const LANGUAGES = [
  { code: 'ta-IN', name: 'Tamil (தமிழ்)' },
  { code: 'en-IN', name: 'English (India)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)' },
  { code: 'te-IN', name: 'Telugu (తెలుగు)' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml-IN', name: 'Malayalam (മലയാളம்)' },
  { code: 'bn-IN', name: 'Bengali (বাংলা)' },
  { code: 'es-ES', name: 'Spanish (Español)' },
  { code: 'fr-FR', name: 'French (Français)' },
];

const SUGGESTED_TITLES = [
  { text: "The Echo Chambers of Silent Voices", category: "Philosophy" },
  { text: "Cyber-Poetics: Whispering Classical Verses to Silicon", category: "Technology" },
  { text: "இணைய அலைகளில் தமிழ் குரல்: ஒரு புதிய மறுமலர்ச்சி", category: "Culture" },
  { text: "The Architecture of Unspoken Thoughts", category: "Psychology" },
  { text: "Beyond Bytes: Resurrecting Ancient Couplets in a Neural Era", category: "Technology" },
  { text: "இரும்பு இதயங்களின் கவிதை மொழி", category: "Poetry" },
  { text: "The Weight of a Whispered Syllable", category: "Art" },
  { text: "மின்மினித் துகள்களின் வார்த்தைக் கோலம்", category: "Creative" }
];

export default function WriteBlogPage() {
  const { token, showToast, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if editing a draft
  const draftToEdit = location.state?.draft || null;

  const [title, setTitle] = useState(draftToEdit?.title || '');
  const [content, setContent] = useState(draftToEdit?.content || '');
  const [imageUrl, setImageUrl] = useState(draftToEdit?.image_url || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ta-IN'); // Tamil as default
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // AI Analyser States
  const [aiMetrics, setAiMetrics] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [completing, setCompleting] = useState(false);

  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      
      rec.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak into your microphone.');
      };

      rec.onresult = (event) => {
        let interim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (finalTrans) {
          insertTextAtCursor(finalTrans);
        }
        setInterimTranscript(interim);
      };

      rec.onerror = (e) => {
        console.error('Speech error:', e.error);
        if (e.error === 'not-allowed') {
          showToast('Microphone access denied. Enable permissions in your browser.', 'error');
        } else {
          showToast(`Speech recognition error: ${e.error}`, 'error');
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = rec;
    } else {
      console.warn('Browser Speech API not supported.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Helper to insert transcribed text at current textarea cursor position
  const insertTextAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    // Formatting: add appropriate spacing
    const spacingBefore = start > 0 && currentText[start - 1] !== ' ' ? ' ' : '';
    const formattedText = spacingBefore + textToInsert;

    const newContent = currentText.substring(0, start) + formattedText + currentText.substring(end);
    setContent(newContent);

    // Reposition cursor after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Toggle speech listener
  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast('Speech Recognition is not supported by your current browser. Please try Google Chrome or MS Edge.', 'error');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = selectedLang;
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
        recognitionRef.current.stop();
      }
    }
  };

  // Multer Cover Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error('Image upload failed');
      }

      const data = await res.json();
      setImageUrl(data.fileUrl);
      showToast('Cover image uploaded successfully.');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Blog (Publish or Save as Draft)
  const saveBlog = async (status) => {
    if (!title.trim()) {
      showToast('A title is required to write a dispatch.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const url = draftToEdit ? `/api/blogs/${draftToEdit.id}` : '/api/blogs';
      const method = draftToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          image_url: imageUrl || null,
          status
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit blog');
      }

      if (status === 'published') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast('Your dispatch is live!');
        navigate('/');
      } else {
        showToast('Dispatch saved in drafts.');
        navigate('/drafts');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // AI Analyser Methods
  const analyzeDraft = async () => {
    if (!content.trim()) {
      showToast('Please write some content to analyze.', 'error');
      return;
    }
    setAnalyzing(true);
    try {
      const res = await fetch('/api/blogs/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      if (res.ok) {
        const data = await res.json();
        setAiMetrics(data.metrics);
        setAiSuggestions(data.suggestions);
        showToast('AI analysis completed successfully.');
      } else {
        throw new Error('Analysis failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not complete AI analysis.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const autocompleteDraft = async () => {
    setCompleting(true);
    try {
      const res = await fetch('/api/blogs/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      if (res.ok) {
        const data = await res.json();
        // Append completion
        setContent(prev => prev + data.completion);

        confetti({
          particleCount: 80,
          spread: 60,
          colors: ['#14b8a6', '#a855f7']
        });
        showToast('AI completion appended successfully!');
      } else {
        throw new Error('Completion failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not complete prose.', 'error');
    } finally {
      setCompleting(false);
    }
  };

  const polishProse = () => {
    if (!content.trim()) {
      showToast('Nothing to polish.', 'error');
      return;
    }
    let polished = content
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\.\s*/g, '. ')
      .trim();

    // Simple capitalization for sentences (English only)
    polished = polished.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, separator, char) => {
      return separator + char.toUpperCase();
    });

    setContent(polished);
    showToast('Prose polished and formatted!');
  };

  return (
    <div className="container fade-in" style={{ paddingBottom: '80px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px',
        textAlign: 'left'
      }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline"
          style={{ padding: '8px 12px', borderRadius: '50%' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0 }}>
            {draftToEdit ? 'Refine Dispatch' : 'Compose Dispatch'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {draftToEdit ? 'Editing your saved draft' : 'Create a new blog story'}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1.1fr',
        gap: '32px',
        textAlign: 'left'
      }}>
        {/* Main Editor Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Cover Image Upload Area */}
          <div className="glass-panel" style={{
            padding: '24px',
            position: 'relative',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderStyle: imageUrl ? 'solid' : 'dashed',
            borderWidth: '2px',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Cover Preview"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(10, 11, 16, 0.55)',
                  backdropFilter: 'blur(3px)',
                  zIndex: 1
                }} />
                
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '16px' }}>
                  <label className="btn btn-outline" style={{ cursor: 'pointer', background: 'rgba(0,0,0,0.5)' }}>
                    <Upload size={16} />
                    Replace Cover
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'rgba(244, 63, 94, 0.6)' }}
                    onClick={() => setImageUrl('')}
                  >
                    Remove Cover
                  </button>
                </div>
              </>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '16px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-glass)'
                }}>
                  <Image size={32} color="var(--color-primary)" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Click to upload cover image</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG, GIF up to 5MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            )}

            {uploadingImage && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(10, 11, 16, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}>
                <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Uploading Cover...</span>
              </div>
            )}
          </div>

          {/* Title and Body */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Dispatch Title</span>
                <span style={{ fontSize: '0.75rem', textTransform: 'none', color: 'var(--text-muted)' }}>
                  Type your own or select a high-impact template below
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                style={{
                  fontSize: '1.8rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  border: 'none',
                  borderBottom: '1px solid var(--border-glass)',
                  borderRadius: 0,
                  background: 'transparent',
                  padding: '8px 0 16px 0',
                  marginBottom: '16px'
                }}
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
              />

              {/* High-Impact Title Selection Section */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px'
                }}>
                  Inspiration: Suggested High-Impact Titles
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {SUGGESTED_TITLES.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTitle(t.text);
                        showToast(`Title Selected: "${t.text}"`);
                      }}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: title === t.text ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                        borderRadius: '20px',
                        color: title === t.text ? 'var(--color-primary)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{
                        fontSize: '0.65rem',
                        background: t.category === 'Culture' || t.category === 'Poetry' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(20, 184, 166, 0.15)',
                        color: t.category === 'Culture' || t.category === 'Poetry' ? 'var(--color-secondary)' : 'var(--color-primary)',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontWeight: 700
                      }}>
                        {t.category}
                      </span>
                      {t.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                <span>Write Blog</span>
                <span style={{ fontSize: '0.75rem', textTransform: 'none', color: 'var(--text-muted)' }}>
                  Supports Tamil, English, and speech dictation
                </span>
              </label>
              
              <textarea
                ref={textareaRef}
                className="form-input"
                style={{
                  minHeight: '400px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 0,
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  resize: 'vertical',
                  padding: '8px 0'
                }}
                placeholder="Start your creative writing here... write in Tamil (தமிழ்), English or recite..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={submitting}
              />

              {interimTranscript && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(20, 184, 166, 0.05)',
                  border: '1px dashed var(--color-primary)',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  marginTop: '12px',
                  fontStyle: 'italic'
                }}>
                  <strong style={{ color: 'var(--color-primary)' }}>Transcribing: </strong>
                  {interimTranscript}
                </div>
              )}
            </div>
          </div>

          {/* AI Content Studio Panel */}
          <div className="glass-panel" style={{ padding: '32px', marginTop: '24px', position: 'relative' }}>
            {/* Glowing orb in panel */}
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              opacity: 0.05,
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>AI Content Studio</h3>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={polishProse}
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  disabled={submitting || analyzing || completing}
                >
                  Polish Prose
                </button>
                <button
                  type="button"
                  onClick={autocompleteDraft}
                  className="btn btn-outline"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                    color: 'var(--color-secondary)'
                  }}
                  disabled={submitting || analyzing || completing}
                >
                  {completing ? 'Completing...' : 'AI Smart Complete'}
                </button>
                <button
                  type="button"
                  onClick={analyzeDraft}
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  disabled={submitting || analyzing || completing}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Draft'}
                </button>
              </div>
            </div>

            {aiMetrics ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '32px' }} className="fade-in">
                {/* Left metrics column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid var(--border-glass)', paddingRight: '32px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '4px solid var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      boxShadow: '0 0 15px rgba(20, 184, 166, 0.2)',
                      marginBottom: '10px'
                    }}>
                      {aiMetrics.score}
                    </div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Readability Score
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tone:</span>
                      <strong style={{ color: 'var(--color-secondary)' }}>{aiMetrics.tone}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Language:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{aiMetrics.language}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Words:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{aiMetrics.wordCount}</strong>
                    </div>
                  </div>
                </div>

                {/* Right suggestions column */}
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} color="var(--color-primary)" />
                    AI Actionable Suggestions
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: 0, listStyle: 'none' }}>
                    {aiSuggestions.map((sug, idx) => (
                      <li
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5
                        }}
                      >
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                <Sparkles size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontSize: '0.9rem' }}>
                  Click "Analyze Draft" to evaluate tone, readability, and retrieve creative recommendations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Speech Control Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="var(--color-primary)" />
              Voice Dictation
            </h3>

            <div className="form-group">
              <label className="form-label">Speech Language</label>
              <select
                className="form-input"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  paddingRight: '32px'
                }}
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                disabled={isListening}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} style={{ background: '#11131e', color: 'white' }}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={toggleListening}
              className={`btn ${isListening ? 'pulse-active' : 'btn-outline'}`}
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '10px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {isListening ? (
                <>
                  <MicOff size={20} />
                  Stop Reciting
                </>
              ) : (
                <>
                  <Mic size={20} color="var(--color-primary)" />
                  Recite Blog Content
                </>
              )}
            </button>

            {/* Dictation Tip Card */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Tips:</strong> Speak clearly. Select Tamil to write in Tamil or Tanglish. The transcript will insert directly at your text cursor.
            </div>
          </div>

          {/* Save Controls */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--color-secondary)" />
              Actions
            </h3>

            <button
              onClick={() => saveBlog('published')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
              disabled={submitting}
            >
              <Send size={18} />
              {submitting ? 'Publishing...' : 'Publish'}
            </button>

            <button
              onClick={() => saveBlog('draft')}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '14px' }}
              disabled={submitting}
            >
              <Save size={18} />
              {submitting ? 'Saving...' : 'Save as Draft'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
