import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: '800',
          color: 'var(--green-primary)'
        }}>
          FursaHub
        </span>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            textDecoration: 'none'
          }}>
            Sign In
          </Link>
          <Link to="/register" style={{
            background: 'var(--green-primary)',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: 'var(--radius)',
            fontSize: '0.9rem',
            fontWeight: '700',
            textDecoration: 'none'
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'var(--green-deep)',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(29, 158, 117, 0.2)',
            border: '1px solid rgba(29, 158, 117, 0.4)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: '#1D9E75',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            Built for Kakuma Youth
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '800',
            color: '#FFFFFF',
            lineHeight: '1.2',
            marginBottom: '20px'
          }}>
            Your Next Opportunity
            <br />
            <span style={{ color: 'var(--green-primary)' }}>
              Starts Here
            </span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#A8CFC0',
            lineHeight: '1.7',
            marginBottom: '40px',
            maxWidth: '520px',
            margin: '0 auto 40px'
          }}>
            FursaHub connects youth in Kakuma Refugee Camp with courses,
            mentorship, and opportunities posted by NGOs and CBOs —
            all in one place.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/register" style={{
              background: 'var(--green-primary)',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: 'var(--radius)',
              fontSize: '1rem',
              fontWeight: '700',
              textDecoration: 'none'
            }}>
              Find Opportunities
            </Link>
            <Link to="/org/register" style={{
              background: 'transparent',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: 'var(--radius)',
              fontSize: '1rem',
              fontWeight: '700',
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              Post a Course
            </Link>
          </div>
        </div>
      </div>

      {/* The Problem */}
      <div style={{
        background: 'var(--bg-section-alt)',
        padding: '72px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            The Problem We're Solving
          </h2>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.8'
          }}>
            In Kakuma, courses and opportunities are announced through street
            posters that get torn down, WhatsApp messages that get buried, and
            Facebook posts that not everyone sees. Talented youth miss life-changing
            opportunities simply because they didn't hear about them in time.
            <br /><br />
            <strong style={{ color: 'var(--text-primary)' }}>
              FursaHub fixes that.
            </strong>
          </p>
        </div>
      </div>

      {/* How it works */}
      <div style={{
        background: 'var(--green-deep)',
        padding: '72px 24px'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '56px'
          }}>
            How It Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                number: '01',
                title: 'Create Your Account',
                desc: 'Register as a youth or organisation in under 2 minutes'
              },
              {
                number: '02',
                title: 'Explore Opportunities',
                desc: 'Browse courses posted by verified NGOs and CBOs in Kakuma'
              },
              {
                number: '03',
                title: 'Apply Directly',
                desc: 'Submit your application inside FursaHub — no WhatsApp needed'
              },
              {
                number: '04',
                title: 'Track Everything',
                desc: 'Get notified when you are shortlisted, accepted or rejected'
              }
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: 'var(--green-primary)',
                  opacity: 0.6,
                  marginBottom: '12px'
                }}>
                  {step.number}
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '8px'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '0.88rem',
                  color: '#A8CFC0',
                  lineHeight: '1.6'
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For Youth / For Orgs */}
      <div style={{ padding: '72px 24px', background: 'var(--bg-base)' }}>
        <div style={{
          maxWidth: '860px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Youth */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: '36px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '16px'
            }}>
              🎓
            </div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '12px'
            }}>
              For Youth
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              marginBottom: '24px'
            }}>
              Whether you're a refugee or host community youth — FursaHub
              gives you one place to find every course, training, and
              opportunity available in Kakuma. Apply, track, and get notified.
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '28px'
            }}>
              {[
                'Browse all available courses',
                'Apply directly from the platform',
                'Track your application status',
                'Get notified when shortlisted'
              ].map((item, i) => (
                <li key={i} style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  padding: '6px 0',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}>
                  <span style={{ color: 'var(--green-primary)', fontWeight: '700' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" style={{
              display: 'block',
              textAlign: 'center',
              background: 'var(--green-primary)',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 'var(--radius)',
              fontSize: '0.95rem',
              fontWeight: '700',
              textDecoration: 'none'
            }}>
              Register as Youth
            </Link>
          </div>

          {/* Organisations */}
          <div style={{
            background: 'var(--amber-warm)',
            border: '1px solid #E8D5B0',
            borderRadius: 'var(--radius)',
            padding: '36px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '16px'
            }}>
              🏢
            </div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              color: 'var(--green-deep)',
              marginBottom: '12px'
            }}>
              For Organisations
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#5C4A2A',
              lineHeight: '1.7',
              marginBottom: '24px'
            }}>
              NGOs and CBOs in Kakuma can post courses and opportunities
              directly to verified youth. Manage applications, shortlist
              candidates, and track impact — all from one dashboard.
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '28px'
            }}>
              {[
                'Post courses in minutes',
                'Reach verified Kakuma youth',
                'Manage applications in one place',
                'Shortlist and notify candidates'
              ].map((item, i) => (
                <li key={i} style={{
                  fontSize: '0.88rem',
                  color: '#5C4A2A',
                  padding: '6px 0',
                  borderBottom: '1px solid #E8D5B0',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: 'var(--green-deep)',
                    fontWeight: '700'
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/org/register" style={{
              display: 'block',
              textAlign: 'center',
              background: 'var(--green-deep)',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 'var(--radius)',
              fontSize: '0.95rem',
              fontWeight: '700',
              textDecoration: 'none'
            }}>
              Register Your Organisation
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{
        background: 'var(--green-primary)',
        padding: '72px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            Ready to Find Your Fursa?
          </h2>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '32px'
          }}>
            Join youth and organisations already using FursaHub in Kakuma.
          </p>
          <Link to="/register" style={{
            background: '#FFFFFF',
            color: 'var(--green-primary)',
            padding: '14px 40px',
            borderRadius: 'var(--radius)',
            fontSize: '1rem',
            fontWeight: '800',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'var(--footer-bg)',
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '800',
            color: 'var(--green-primary)',
            marginBottom: '8px'
          }}>
            FursaHub
          </p>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--footer-text)',
            marginBottom: '24px'
          }}>
            Connecting Kakuma youth to the opportunities they deserve.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}>
            {[
              { label: 'For Youth', link: '/register' },
              { label: 'For Organisations', link: '/org/register' },
              { label: 'Sign In', link: '/login' }
            ].map((item, i) => (
              <Link key={i} to={item.link} style={{
                fontSize: '0.85rem',
                color: 'var(--footer-text)',
                textDecoration: 'none',
                opacity: 0.7
              }}>
                {item.label}
              </Link>
            ))}
          </div>

          <p style={{
            fontSize: '0.78rem',
            color: 'var(--footer-text)',
            opacity: 0.5
          }}>
            © 2026 FursaHub. Built for the youth of Kakuma.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;