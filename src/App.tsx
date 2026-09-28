import { useState } from 'react'
import './index.css'

type Role = 'admin' | 'teacher' | 'parent' | null
type Tab = 'home' | 'modules' | 'messages' | 'profile' | 'students' | 'teachers' | 'parents'

const modules = [
  { id: 1, name: 'Motor Beceriler - Seviye 2', date: '28 Eyl 2026', teacher: 'Ayşe Yılmaz', progress: 75, homework: 'Evde 15 dk top tutma çalışması' },
  { id: 2, name: 'Dil ve Konuşma', date: '27 Eyl 2026', teacher: 'Mehmet Kaya', progress: 60, homework: 'Resimli kartlarla 10 kelime tekrarı' },
  { id: 3, name: 'Duyu Bütünleme', date: '25 Eyl 2026', teacher: 'Ayşe Yılmaz', progress: 40, homework: 'Fırça ile dokunsal oyun' },
]

const students = [
  { id: 1, name: 'Ali Demir', age: 7, modules: 3, last: '28 Eyl' },
  { id: 2, name: 'Zeynep Kara', age: 5, modules: 2, last: '27 Eyl' },
  { id: 3, name: 'Efe Yıldız', age: 8, modules: 4, last: '26 Eyl' },
]

const messages = [
  { id: 1, from: 'Ayşe Yılmaz', text: 'Ali bugün çok iyiydi, ödevi birlikte yapabilirsiniz.', time: '14:32', unread: true },
  { id: 2, from: 'Müdür', text: 'Yarın toplantı var, lütfen katılın.', time: '09:15', unread: false },
]

function App() {
  const [role, setRole] = useState<Role>(null)
  const [tab, setTab] = useState<Tab>('home')
  const [selectedRole, setSelectedRole] = useState<Role>(null)

  if (!role) {
    return (
      <div id="root">
        <div className="status-bar">
          <span>22:59</span>
          <span>📶 🔋</span>
        </div>
        <div className="login-screen">
          <div className="logo">
            <div className="logo-icon">🧠</div>
            <h1>RehabConnect</h1>
            <p>Rehabilitasyon Merkezi Uygulaması</p>
          </div>

          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 8, fontSize: 14 }}>
            Demo için rol seçin
          </p>

          <div className="role-select">
            <button
              className={'role-btn ' + (selectedRole === 'parent' ? 'selected' : '')}
              onClick={() => setSelectedRole('parent')}
            >
              <div className="role-icon" style={{ background: '#dbeafe' }}>👨‍👩‍👧</div>
              <div className="role-info">
                <h3>Veli</h3>
                <p>Çocuğunuzun gelişimini takip edin</p>
              </div>
            </button>

            <button
              className={'role-btn ' + (selectedRole === 'teacher' ? 'selected' : '')}
              onClick={() => setSelectedRole('teacher')}
            >
              <div className="role-icon" style={{ background: '#dcfce7' }}>👩‍🏫</div>
              <div className="role-info">
                <h3>Öğretmen / Terapist</h3>
                <p>Modül gir, ödev ver, not al</p>
              </div>
            </button>

            <button
              className={'role-btn ' + (selectedRole === 'admin' ? 'selected' : '')}
              onClick={() => setSelectedRole('admin')}
            >
              <div className="role-icon" style={{ background: '#fef3c7' }}>👔</div>
              <div className="role-info">
                <h3>Yönetici (Müdür)</h3>
                <p>Tüm sistemi yönet, mesaj at</p>
              </div>
            </button>
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: 32 }}
            disabled={!selectedRole}
            onClick={() => {
              if (selectedRole) {
                setRole(selectedRole)
                setTab('home')
              }
            }}
          >
            Giriş Yap (Demo)
          </button>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#94a3b8' }}>
            Gerçek versiyonda e-posta + şifre olacak
          </p>
        </div>
      </div>
    )
  }

  const Header = ({ title }: { title: string }) => (
    <div className="header">
      <h1>{title}</h1>
      <span className="role-badge">
        {role === 'parent' ? 'Veli' : role === 'teacher' ? 'Öğretmen' : 'Yönetici'}
      </span>
    </div>
  )

  const ParentHome = () => (
    <>
      <Header title="Merhaba, Ayşe Hanım" />
      <div className="content">
        <div className="card">
          <div className="card-title">Ali Demir · 7 yaş</div>
          <div className="card-sub">Son seans: 28 Eylül 2026</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }} />
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>Genel gelişim: %65</div>
        </div>

        <h3 style={{ fontSize: 15, margin: '16px 0 10px', fontWeight: 600 }}>Son İşlenen Modüller</h3>
        {modules.slice(0, 2).map(m => (
          <div className="card" key={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="card-title">{m.name}</div>
                <div className="card-sub">{m.date} · {m.teacher}</div>
              </div>
              <span className="badge badge-blue">%{m.progress}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, background: '#f8fafc', padding: 10, borderRadius: 8 }}>
              📝 Ödev: {m.homework}
            </div>
          </div>
        ))}

        <button className="btn btn-outline" onClick={() => setTab('modules')}>
          Tüm Modülleri Gör
        </button>
      </div>
    </>
  )

  const ParentModules = () => (
    <>
      <Header title="İşlenen Modüller" />
      <div className="content">
        {modules.map(m => (
          <div className="card" key={m.id}>
            <div className="card-title">{m.name}</div>
            <div className="card-sub">{m.date} · {m.teacher}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: m.progress + '%' }} />
            </div>
            <div style={{ fontSize: 12, marginTop: 6, color: '#64748b' }}>İlerleme: %{m.progress}</div>
            <div style={{ marginTop: 10, fontSize: 13, background: '#f0fdf4', padding: 10, borderRadius: 8, border: '1px solid #bbf7d0' }}>
              <strong>Ödev:</strong> {m.homework}
            </div>
          </div>
        ))}
      </div>
    </>
  )

  const TeacherHome = () => (
    <>
      <Header title="Öğretmen Paneli" />
      <div className="content">
        <div className="card" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div className="card-title">Bugün 3 seans var</div>
          <div className="card-sub">Ali Demir · Zeynep Kara · Efe Yıldız</div>
        </div>

        <h3 style={{ fontSize: 15, margin: '16px 0 10px', fontWeight: 600 }}>Öğrencilerim</h3>
        {students.map(s => (
          <div className="list-item" key={s.id}>
            <div className="avatar">{s.name.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{s.age} yaş · Son: {s.last}</div>
            </div>
            <span className="badge badge-gray">{s.modules} modül</span>
          </div>
        ))}

        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setTab('modules')}>
          + Yeni Modül Gir
        </button>
      </div>
    </>
  )

  const TeacherModules = () => (
    <>
      <Header title="Modül Girişi" />
      <div className="content">
        <div className="card">
          <label className="label">Öğrenci</label>
          <select className="input">
            <option>Ali Demir</option>
            <option>Zeynep Kara</option>
            <option>Efe Yıldız</option>
          </select>

          <label className="label">Modül Adı</label>
          <input className="input" placeholder="Örn: Motor Beceriler - Seviye 3" />

          <label className="label">İlerleme %</label>
          <input className="input" type="number" placeholder="0-100" defaultValue={70} />

          <label className="label">Gelişim Notu</label>
          <textarea className="input" rows={3} placeholder="Bugün neler yaptık, nasıl ilerledi..." style={{ resize: 'none' }} />

          <label className="label">Ödev</label>
          <textarea className="input" rows={2} placeholder="Evde yapılacak çalışma..." style={{ resize: 'none' }} />

          <button className="btn btn-primary" style={{ marginTop: 8 }}>
            Kaydet ve Veliye Bildir
          </button>
        </div>
      </div>
    </>
  )

  const AdminHome = () => (
    <>
      <Header title="Yönetici Paneli" />
      <div className="content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#2563eb' }}>12</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Öğretmen</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#16a34a' }}>48</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Veli</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#d97706' }}>86</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Öğrenci</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#7c3aed' }}>214</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Modül</div>
          </div>
        </div>

        <h3 style={{ fontSize: 15, margin: '8px 0 10px', fontWeight: 600 }}>Hızlı İşlemler</h3>
        <div className="btn-row">
          <button className="btn btn-outline btn-sm" onClick={() => setTab('teachers')}>Öğretmenler</button>
          <button className="btn btn-outline btn-sm" onClick={() => setTab('parents')}>Veliler</button>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setTab('messages')}>
          Toplu Mesaj Gönder
        </button>
      </div>
    </>
  )

  const AdminTeachers = () => (
    <>
      <Header title="Öğretmenler" />
      <div className="content">
        {['Ayşe Yılmaz', 'Mehmet Kaya', 'Selin Arslan', 'Can Öztürk'].map((name, i) => (
          <div className="list-item" key={i}>
            <div className="avatar">{name.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{i % 2 === 0 ? 'Fizyoterapist' : 'Dil Terapisti'}</div>
            </div>
            <button className="btn btn-sm btn-outline">Düzenle</button>
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 16 }}>+ Yeni Öğretmen Ekle</button>
      </div>
    </>
  )

  const AdminParents = () => (
    <>
      <Header title="Veliler" />
      <div className="content">
        {['Ayşe Demir (Ali)', 'Fatma Kara (Zeynep)', 'Hasan Yıldız (Efe)', 'Zeynep Ak (Elif)'].map((name, i) => (
          <div className="list-item" key={i}>
            <div className="avatar">{name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>05{i}2 345 67 8{i}</div>
            </div>
            <button className="btn btn-sm btn-outline">Mesaj</button>
          </div>
        ))}
      </div>
    </>
  )

  const Messages = () => (
    <>
      <Header title="Mesajlar" />
      <div className="content">
        {messages.map(m => (
          <div className="card" key={m.id} style={{ borderLeft: m.unread ? '4px solid #2563eb' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="card-title">{m.from}</div>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{m.time}</span>
            </div>
            <div className="card-sub">{m.text}</div>
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 8 }}>
          + Yeni Mesaj
        </button>
      </div>
    </>
  )

  const Profile = () => (
    <>
      <Header title="Profil" />
      <div className="content">
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div className="avatar" style={{ width: 72, height: 72, fontSize: 28, margin: '0 auto 12px' }}>
            {role === 'parent' ? 'AD' : role === 'teacher' ? 'AY' : 'MD'}
          </div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>
            {role === 'parent' ? 'Ayşe Demir' : role === 'teacher' ? 'Ayşe Yılmaz' : 'Mehmet Müdür'}
          </div>
          <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            {role === 'parent' ? 'Veli · Ali Demir' : role === 'teacher' ? 'Fizyoterapist' : 'Kurum Yöneticisi'}
          </div>
        </div>

        <div className="card">
          <div className="list-item">
            <span>🏢 Kurum</span>
            <span style={{ marginLeft: 'auto', color: '#64748b' }}>Örnek Rehab Merkezi</span>
          </div>
          <div className="list-item">
            <span>📧 E-posta</span>
            <span style={{ marginLeft: 'auto', color: '#64748b' }}>demo@rehab.com</span>
          </div>
        </div>

        <button
          className="btn btn-outline"
          style={{ color: '#dc2626', borderColor: '#dc2626', marginTop: 16 }}
          onClick={() => { setRole(null); setSelectedRole(null) }}
        >
          Çıkış Yap
        </button>
      </div>
    </>
  )

  const BottomNav = () => {
    if (role === 'parent') {
      return (
        <div className="bottom-nav">
          <button className={'nav-item ' + (tab === 'home' ? 'active' : '')} onClick={() => setTab('home')}>
            <span className="nav-icon">🏠</span> Ana Sayfa
          </button>
          <button className={'nav-item ' + (tab === 'modules' ? 'active' : '')} onClick={() => setTab('modules')}>
            <span className="nav-icon">📚</span> Modüller
          </button>
          <button className={'nav-item ' + (tab === 'messages' ? 'active' : '')} onClick={() => setTab('messages')}>
            <span className="nav-icon">💬</span> Mesajlar
          </button>
          <button className={'nav-item ' + (tab === 'profile' ? 'active' : '')} onClick={() => setTab('profile')}>
            <span className="nav-icon">👤</span> Profil
          </button>
        </div>
      )
    }
    if (role === 'teacher') {
      return (
        <div className="bottom-nav">
          <button className={'nav-item ' + (tab === 'home' ? 'active' : '')} onClick={() => setTab('home')}>
            <span className="nav-icon">🏠</span> Ana Sayfa
          </button>
          <button className={'nav-item ' + (tab === 'modules' ? 'active' : '')} onClick={() => setTab('modules')}>
            <span className="nav-icon">➕</span> Modül Gir
          </button>
          <button className={'nav-item ' + (tab === 'messages' ? 'active' : '')} onClick={() => setTab('messages')}>
            <span className="nav-icon">💬</span> Mesajlar
          </button>
          <button className={'nav-item ' + (tab === 'profile' ? 'active' : '')} onClick={() => setTab('profile')}>
            <span className="nav-icon">👤</span> Profil
          </button>
        </div>
      )
    }
    return (
      <div className="bottom-nav">
        <button className={'nav-item ' + (tab === 'home' ? 'active' : '')} onClick={() => setTab('home')}>
          <span className="nav-icon">🏠</span> Panel
        </button>
        <button className={'nav-item ' + (tab === 'teachers' ? 'active' : '')} onClick={() => setTab('teachers')}>
          <span className="nav-icon">👩‍🏫</span> Öğretmen
        </button>
        <button className={'nav-item ' + (tab === 'parents' ? 'active' : '')} onClick={() => setTab('parents')}>
          <span className="nav-icon">👨‍👩‍👧</span> Veliler
        </button>
        <button className={'nav-item ' + (tab === 'messages' ? 'active' : '')} onClick={() => setTab('messages')}>
          <span className="nav-icon">💬</span> Mesaj
        </button>
        <button className={'nav-item ' + (tab === 'profile' ? 'active' : '')} onClick={() => setTab('profile')}>
          <span className="nav-icon">👤</span> Profil
        </button>
      </div>
    )
  }

  return (
    <div id="root">
      <div className="status-bar">
        <span>22:59</span>
        <span>📶 🔋</span>
      </div>

      {role === 'parent' && tab === 'home' && <ParentHome />}
      {role === 'parent' && tab === 'modules' && <ParentModules />}
      {role === 'teacher' && tab === 'home' && <TeacherHome />}
      {role === 'teacher' && tab === 'modules' && <TeacherModules />}
      {role === 'admin' && tab === 'home' && <AdminHome />}
      {role === 'admin' && tab === 'teachers' && <AdminTeachers />}
      {role === 'admin' && tab === 'parents' && <AdminParents />}
      {tab === 'messages' && <Messages />}
      {tab === 'profile' && <Profile />}

      <BottomNav />
    </div>
  )
}

export default App