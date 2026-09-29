import { useState } from 'react'
import './index.css'

type Role = 'admin' | 'teacher' | 'parent' | null
type Tab = 'home' | 'modules' | 'messages' | 'profile' | 'students' | 'teachers' | 'parents' | 'audit'
type ModuleRecord = { id: number; name: string; category: string; date: string; teacher: string; progress: number; homework: string; note?: string; student?: string; monthKey?: string }
type MessageRecord = { id: number; from: string; to: string; student: string; text: string; time: string; unread: boolean }
type PendingMedia = { name: string; type: string; url: string; size: number; duration?: number }
type MediaRecord = PendingMedia & { id: number; student: string; sender: string; date: string }

const currentMonthKey = () => new Date().toISOString().slice(0, 7)
const currentDateLabel = () => new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })

const moduleCatalog = [
  { category: 'Öğrenme Güçlüğü Olan Bireyler', modules: ['Öğrenmeye Destek · Görsel Algı', 'Öğrenmeye Destek · İşitsel Algı', 'Öğrenmeye Destek · Dokunsal Algı', 'Öğrenmeye Destek · Motor Planlama', 'Öğrenmeye Destek · Kendini Düzenleme', 'Dil ve İletişim · Sesletim', 'Dil ve İletişim · Sözcük Dağarcığı', 'Dil ve İletişim · Biçim-Anlam', 'Dil ve İletişim · İletişim İşlevleri', 'Okuma ve Yazma · Erken Okuryazarlık', 'Okuma ve Yazma · İlk Okuma-Yazma', 'Okuma ve Yazma · Akıcı Okuma', 'Okuma ve Yazma · Dinlediğini Anlama', 'Okuma ve Yazma · Yazılı Anlatım', 'Okuma ve Yazma · Dil Bilgisi', 'Erken Matematik', 'Matematik', 'Sosyal Etkileşim'] },
  { category: 'Otizm Spektrum Bozukluğu Olan Bireyler', modules: ['Öğrenmeye Destek', 'Dil, İletişim ve Oyun', 'Sosyal Beceriler', 'Okuma ve Yazma', 'Erken Matematik', 'Matematik', 'Birey ve Çevre', 'Öz Bakım Becerileri', 'Günlük Yaşam Becerileri', 'Toplumsal Yaşam Becerileri'] },
  { category: 'Dil ve Konuşma Bozukluğu Olan Bireyler', modules: ['Akıcı Konuşma · Kekemelik', 'Akıcı Konuşma · Hızlı-Bozuk Konuşma', 'Dil · Söz Öncesi Dönem', 'Dil · Söz Dönemi', 'Edinilmiş Dil · Afazi', 'Edinilmiş Dil · Bilişsel-İletişimsel Bozukluk', 'Konuşma Sesi', 'Motor Konuşma · Dizartri', 'Motor Konuşma · Apraksi', 'Rezonans', 'Ses'] },
  { category: 'Bedensel Yetersizliği Olan Bireyler', modules: ['Başlangıç Düzey Motor Beceriler', 'Oturma', 'Yürümeye Hazırlık', 'Yürüme', 'İleri Düzey Kaba Motor Beceriler', 'İnce Motor Beceriler', 'Duyu Algı / Motor-Duyusal İşlemleme', 'Günlük Yaşam Aktiviteleri'] },
  { category: 'Zihinsel Yetersizliği Olan Bireyler', modules: ['Öğrenmeye Destek', 'Dil, İletişim ve Oyun', 'Sosyal Beceriler', 'Okuma ve Yazma', 'Erken Matematik', 'Matematik', 'Birey ve Çevre', 'Öz Bakım Becerileri', 'Günlük Yaşam Becerileri', 'Toplumsal Yaşam Becerileri'] },
]

const modules: ModuleRecord[] = [
  { id: 1, name: 'Başlangıç Düzey Motor Beceriler', category: 'Bedensel Yetersizliği Olan Bireyler', date: '28 Eyl 2026', teacher: 'Ayşe Yılmaz', progress: 75, homework: 'Evde 15 dk top tutma çalışması', student: 'Ali Demir', monthKey: currentMonthKey() },
  { id: 2, name: 'Dil ve İletişim · Sözcük Dağarcığı', category: 'Öğrenme Güçlüğü Olan Bireyler', date: '27 Eyl 2026', teacher: 'Mehmet Kaya', progress: 60, homework: 'Resimli kartlarla 10 kelime tekrarı', student: 'Zeynep Kara', monthKey: currentMonthKey() },
  { id: 3, name: 'Sosyal Beceriler', category: 'Otizm Spektrum Bozukluğu Olan Bireyler', date: '25 Eyl 2026', teacher: 'Ayşe Yılmaz', progress: 40, homework: 'Sıra alma oyunu oynayın', student: 'Ali Demir', monthKey: currentMonthKey() },
]

const students = [
  { id: 1, name: 'Ali Demir', age: 7, modules: 3, last: '28 Eyl' },
  { id: 2, name: 'Zeynep Kara', age: 5, modules: 2, last: '27 Eyl' },
  { id: 3, name: 'Efe Yıldız', age: 8, modules: 4, last: '26 Eyl' },
]

const messages: MessageRecord[] = [
  { id: 1, from: 'Ayşe Yılmaz', to: 'Ayşe Demir', student: 'Ali Demir', text: 'Ali bugün çok iyiydi, ödevi birlikte yapabilirsiniz.', time: '14:32', unread: true },
  { id: 2, from: 'Ayşe Demir', to: 'Ayşe Yılmaz', student: 'Ali Demir', text: 'Bilgilendirme için teşekkür ederim.', time: '14:40', unread: false },
  { id: 3, from: 'Müdür', to: 'Ayşe Yılmaz', student: 'Ali Demir', text: 'Yarın toplantı var, lütfen katılın.', time: '09:15', unread: false },
]

function App() {
  const [role, setRole] = useState<Role>(null)
  const [tab, setTab] = useState<Tab>('home')
  const [selectedRole, setSelectedRole] = useState<Role>(null)
  const [selectedCategory, setSelectedCategory] = useState(moduleCatalog[0].category)
  const [selectedModules, setSelectedModules] = useState<{ category: string; name: string }[]>([])
  const [moduleWarning, setModuleWarning] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(students[0].name)
  const [progress, setProgress] = useState(70)
  const [homework, setHomework] = useState('')
  const [lessonNote, setLessonNote] = useState('')
  const [developmentNote, setDevelopmentNote] = useState('')
  const [seedModules, setSeedModules] = useState<ModuleRecord[]>(modules)
  const [savedModules, setSavedModules] = useState<ModuleRecord[]>([])
  const [conversationMessages, setConversationMessages] = useState<MessageRecord[]>(messages)
  const [messageDraft, setMessageDraft] = useState('')
  const [mediaRecords, setMediaRecords] = useState<MediaRecord[]>([])
  const [pendingMedia, setPendingMedia] = useState<PendingMedia | null>(null)
  const [mediaWarning, setMediaWarning] = useState('')
  const [mediaMessage, setMediaMessage] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  const selectMedia = (file?: File) => {
    if (pendingMedia) URL.revokeObjectURL(pendingMedia.url)
    setPendingMedia(null)
    setMediaMessage('')
    if (!file) {
      setMediaWarning('')
      return
    }
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setMediaWarning('Yalnızca fotoğraf veya video seçebilirsiniz.')
      return
    }

    const sizeWarning = file.size > 25 * 1024 * 1024 ? 'Dosya 25 MB üzerinde; gönderim uzun sürebilir. Daha küçük bir dosya önerilir.' : ''
    setMediaWarning(sizeWarning)
    const url = URL.createObjectURL(file)
    if (file.type.startsWith('video/')) {
      const probe = document.createElement('video')
      probe.preload = 'metadata'
      probe.onloadedmetadata = () => {
        if (probe.duration > 60) {
          URL.revokeObjectURL(url)
          setMediaWarning('Video en fazla 1 dakika olabilir; daha kısa bir video seçin.')
          return
        }
        setPendingMedia({ name: file.name, type: file.type, url, size: file.size, duration: probe.duration })
        setMediaWarning(sizeWarning)
      }
      probe.onerror = () => {
        URL.revokeObjectURL(url)
        setMediaWarning('Video süresi okunamadı. Başka bir dosya deneyin.')
      }
      probe.src = url
      setMediaWarning('Video süresi kontrol ediliyor...')
      return
    }
    setPendingMedia({ name: file.name, type: file.type, url, size: file.size })
  }

  const savePendingMedia = (student: string) => {
    if (!pendingMedia) return false
    setMediaRecords(records => [{ ...pendingMedia, id: Date.now(), student, sender: 'Ayşe Yılmaz', date: currentDateLabel() }, ...records])
    setPendingMedia(null)
    setMediaWarning('')
    setMediaMessage('Medya veliye gönderildi.')
    return true
  }

  if (!role) {
    return (
      <div id="root">
        <div className="status-bar">
          <span>22:59</span>
          <span>📶 🔋</span>
        </div>
        <div className="login-screen">
          <div className="logo">
            <div className="brand-mark login-brand-mark">
              <img src="/logo.png" alt="RehabConnect logosu" onLoad={event => event.currentTarget.parentElement?.classList.add('has-logo')} onError={event => { event.currentTarget.style.display = 'none' }} />
              <span className="logo-fallback">RC</span>
            </div>
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
      <div className="header-brand">
        <div className="brand-mark header-brand-mark">
          <img src="/logo.png" alt="" onLoad={event => event.currentTarget.parentElement?.classList.add('has-logo')} onError={event => { event.currentTarget.style.display = 'none' }} />
          <span className="logo-fallback">RC</span>
        </div>
      <h1>{title}</h1>
      </div>
      <span className="role-badge">
        {role === 'parent' ? 'Veli' : role === 'teacher' ? 'Öğretmen' : 'Yönetici'}
      </span>
    </div>
  )

  const MonthlyLimit = ({ student }: { student: string }) => {
    const count = allModules.filter(session => session.student === student && session.monthKey === currentMonthKey()).length
    return (
    <div className="session-limit" role="note">
      <strong>Aylık seans sınırı</strong>
      <span>{student}: bu ay {count}/8 seans. Ayda en fazla 8 seans alınabilir; minimum seans zorunluluğu yoktur.</span>
    </div>
    )
  }

  const allModules = [...savedModules, ...seedModules]

  const ParentHome = () => (
    <>
      <Header title="Merhaba, Ayşe Hanım" />
      <div className="content">
        <MonthlyLimit student="Ali Demir" />
        <div className="card">
          <div className="card-title">Ali Demir · 7 yaş</div>
          <div className="card-sub">Son seans: 28 Eylül 2026</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }} />
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>Genel gelişim: %65</div>
        </div>

        <h3 style={{ fontSize: 15, margin: '16px 0 10px', fontWeight: 600 }}>Son İşlenen Modüller</h3>
        {allModules.filter(m => m.student === 'Ali Demir').slice(0, 2).map(m => (
          <div className="card" key={m.id}>
            <span className="module-category">{m.category}</span>
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
        <MonthlyLimit student="Ali Demir" />
        <div className="module-list">
          {allModules.filter(m => m.student === 'Ali Demir').map(m => (
            <div className="card module-card" key={m.id}>
              <span className="module-category">{m.category}</span>
              <div className="card-title">{m.name}</div>
              <div className="card-sub">{m.date} · {m.teacher}</div>
              <div className="module-progress-label">İlerleme <strong>%{m.progress}</strong></div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: m.progress + '%' }} />
              </div>
              {m.note && <p className="module-note">{m.note}</p>}
              <div className="module-homework"><strong>Ev çalışması</strong><span>{m.homework}</span></div>
            </div>
          ))}
        </div>
        <h3 className="section-heading">Fotoğraf / Video</h3>
        {mediaRecords.filter(media => media.student === 'Ali Demir').length === 0 ? (
          <div className="media-empty">Öğretmen tarafından gönderilen fotoğraf ve videolar burada görünür.</div>
        ) : (
          <div className="media-grid">
            {mediaRecords.filter(media => media.student === 'Ali Demir').map(media => (
              <div className="media-card" key={media.id}>
                {media.type.startsWith('video/') ? <video src={media.url} controls /> : <img src={media.url} alt={media.name} />}
                <div className="media-caption"><strong>{media.name}</strong><span>{media.date} · {media.sender}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  const TeacherHome = () => (
    <>
      <Header title="Öğretmen Paneli" />
      <div className="content">
        <MonthlyLimit student={selectedStudent} />
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

  const TeacherModules = () => {
    const monthlySessions = allModules.filter(session => session.student === selectedStudent && session.monthKey === currentMonthKey()).length
    return (
    <>
      <Header title="Modül Girişi" />
      <div className="content">
        <MonthlyLimit student={selectedStudent} />
        <div className="card">
          <label className="label">Öğrenci</label>
          <select className="input" value={selectedStudent} onChange={event => setSelectedStudent(event.target.value)}>
            {students.map(student => <option key={student.id}>{student.name}</option>)}
          </select>

          <label className="label" htmlFor="module-category">Kategori</label>
          <select id="module-category" className="input" value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)}>
            {moduleCatalog.map(group => <option key={group.category}>{group.category}</option>)}
          </select>

          <div className="module-picker-heading">
            <span className="label">Alt modüller</span>
            <span className="selection-count">{selectedModules.length} / 3 seçili</span>
          </div>
          <div className="module-options">
            {moduleCatalog.find(group => group.category === selectedCategory)?.modules.map(name => {
              const isSelected = selectedModules.some(module => module.category === selectedCategory && module.name === name)
              return (
                <label className={'module-option ' + (isSelected ? 'is-selected' : '')} key={name}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={event => {
                      setModuleWarning('')
                      if (event.target.checked) {
                        if (selectedModules.length >= 3) {
                          setModuleWarning('Bir seansta en fazla 3 modül seçebilirsiniz.')
                          window.alert('Bir seansta en fazla 3 modül seçebilirsiniz.')
                          return
                        }
                        setSelectedModules([...selectedModules, { category: selectedCategory, name }])
                      } else {
                        setSelectedModules(selectedModules.filter(module => module.name !== name || module.category !== selectedCategory))
                      }
                    }}
                  />
                  <span>{name}</span>
                </label>
              )
            })}
          </div>
          {moduleWarning && <p className="form-warning" role="alert">{moduleWarning}</p>}
          {selectedModules.length > 0 && (
            <div className="selected-module-list">
              <span>Bu seansta işlenecekler</span>
              {selectedModules.map(module => <span className="selected-module" key={`${module.category}-${module.name}`}>{module.name}</span>)}
            </div>
          )}

          <label className="label">İlerleme %</label>
          <input className="input" type="number" min="0" max="100" value={progress} onChange={event => setProgress(Math.max(0, Math.min(100, Number(event.target.value))))} />

          <label className="label">Gelişim Notu</label>
          <textarea className="input" rows={3} placeholder="Bugün neler yaptık, nasıl ilerledi..." style={{ resize: 'none' }} value={developmentNote} onChange={event => setDevelopmentNote(event.target.value)} />

          <label className="label">Ödev</label>
          <textarea className="input" rows={2} placeholder="Evde yapılacak çalışma..." style={{ resize: 'none' }} value={homework} onChange={event => setHomework(event.target.value)} />

          <label className="label">Seans Notu / Ders Yorumu</label>
          <textarea className="input" rows={3} placeholder="Seansa dair veliyle paylaşılacak serbest not..." style={{ resize: 'vertical' }} value={lessonNote} onChange={event => setLessonNote(event.target.value)} />

          <label className="label" htmlFor="session-media">Fotoğraf / Video ekle</label>
          <input id="session-media" className="input" type="file" accept="image/*,video/*" onChange={event => selectMedia(event.target.files?.[0])} />
          {mediaWarning && <p className="form-warning" role="status">{mediaWarning}</p>}
          {pendingMedia && <div className="pending-media"><span>{pendingMedia.name}</span><small>{(pendingMedia.size / 1024 / 1024).toFixed(1)} MB{pendingMedia.duration !== undefined ? ` · ${Math.round(pendingMedia.duration)} sn` : ''}</small></div>}
          {mediaMessage && <p className="save-message" role="status">{mediaMessage}</p>}

          {monthlySessions >= 8 && <p className="form-warning" role="alert">Bu öğrenci bu ay 8 seans sınırına ulaştı.</p>}
          {saveMessage && <p className="save-message" role="status">{saveMessage}</p>}
          <button className="btn btn-primary" style={{ marginTop: 8 }} disabled={selectedModules.length === 0 || monthlySessions >= 8} onClick={() => {
            if (monthlySessions >= 8) {
              setModuleWarning(`${selectedStudent} bu ay 8 seans sınırına ulaştı.`)
              return
            }
            const selectedNames = selectedModules.map(module => module.name).join(' · ')
            setSavedModules([{ id: Date.now(), name: selectedNames, category: [...new Set(selectedModules.map(module => module.category))].join(' · '), date: currentDateLabel(), teacher: 'Ayşe Yılmaz', progress, homework: homework || 'Ödev eklenmedi', note: [developmentNote, lessonNote].filter(Boolean).join(' · '), student: selectedStudent, monthKey: currentMonthKey() }, ...savedModules])
            savePendingMedia(selectedStudent)
            setSaveMessage(`${selectedStudent} için seans kaydedildi.`)
            setSelectedModules([])
            setHomework('')
            setLessonNote('')
            setDevelopmentNote('')
          }}>
            Kaydet ve Veliye Bildir
          </button>
          <button className="btn btn-outline" style={{ marginTop: 8 }} disabled={!pendingMedia} onClick={() => savePendingMedia(selectedStudent)}>
            Yalnızca Medya Gönder
          </button>
        </div>
      </div>
    </>
    )
  }

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
        <button className="audit-entry" onClick={() => setTab('audit')}>
          <span className="audit-entry-icon">▤</span>
          <span><strong>Tüm Aktiviteler</strong><small>Mesajlar, seans bildirimleri ve medya</small></span>
          <span className="audit-entry-count">{allModules.length + conversationMessages.length + mediaRecords.length}</span>
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

  const AdminAudit = () => (
    <>
      <Header title="Tüm Aktiviteler" />
      <div className="content">
        <div className="audit-summary">
          <div><strong>{conversationMessages.length}</strong><span>Mesaj</span></div>
          <div><strong>{allModules.length}</strong><span>Seans bildirimi</span></div>
          <div><strong>{mediaRecords.length}</strong><span>Medya</span></div>
        </div>

        <section className="audit-section">
          <h2>Seans / Modül Bildirimleri</h2>
          {allModules.map(session => (
            <article className="audit-item" key={session.id}>
              <div className="audit-item-content">
                <span className="module-category">{session.category}</span>
                <strong>{session.student} · {session.name}</strong>
                <span>{session.date} · {session.teacher} · İlerleme %{session.progress}</span>
                {session.note && <p>{session.note}</p>}
              </div>
              <div className="audit-actions">
                <button className="btn btn-sm btn-outline" onClick={() => {
                  const updatedName = window.prompt('Seans/modül başlığını düzenle', session.name)
                  if (!updatedName?.trim()) return
                  setSavedModules(records => records.map(record => record.id === session.id ? { ...record, name: updatedName.trim() } : record))
                  setSeedModules(records => records.map(record => record.id === session.id ? { ...record, name: updatedName.trim() } : record))
                }}>Düzenle</button>
                <button className="btn btn-sm btn-danger" onClick={() => {
                  if (!window.confirm('Bu seans bildirimi silinsin mi?')) return
                  setSavedModules(records => records.filter(record => record.id !== session.id))
                  setSeedModules(records => records.filter(record => record.id !== session.id))
                }}>Sil</button>
              </div>
            </article>
          ))}
        </section>

        <section className="audit-section">
          <h2>Veli - Öğretmen Mesajları</h2>
          {conversationMessages.map(message => (
            <article className="audit-item" key={message.id}>
              <div className="audit-item-content">
                <strong>{message.from} <span aria-hidden="true">→</span> {message.to}</strong>
                <span>{message.student} · {message.time}</span>
                <p>{message.text}</p>
              </div>
              <div className="audit-actions">
                <button className="btn btn-sm btn-outline" onClick={() => {
                  const text = window.prompt('Mesajı düzenle', message.text)
                  if (text?.trim()) setConversationMessages(records => records.map(record => record.id === message.id ? { ...record, text: text.trim() } : record))
                }}>Düzenle</button>
                <button className="btn btn-sm btn-danger" onClick={() => {
                  if (window.confirm('Bu mesaj silinsin mi?')) setConversationMessages(records => records.filter(record => record.id !== message.id))
                }}>Sil</button>
              </div>
            </article>
          ))}
        </section>

        <section className="audit-section">
          <h2>Gönderilen Fotoğraf ve Videolar</h2>
          {mediaRecords.length === 0 && <p className="media-empty">Henüz gönderilmiş medya yok.</p>}
          {mediaRecords.map(media => (
            <article className="audit-item audit-media-item" key={media.id}>
              {media.type.startsWith('video/') ? <video src={media.url} controls /> : <img src={media.url} alt={media.name} />}
              <div className="audit-item-content">
                <strong>{media.name}</strong>
                <span>{media.student} · {media.sender} · {media.date} · {(media.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <div className="audit-actions">
                <button className="btn btn-sm btn-outline" onClick={() => {
                  const name = window.prompt('Medya adını düzenle', media.name)
                  if (name?.trim()) setMediaRecords(records => records.map(record => record.id === media.id ? { ...record, name: name.trim() } : record))
                }}>Düzenle</button>
                <button className="btn btn-sm btn-danger" onClick={() => {
                  if (!window.confirm('Bu medya silinsin mi?')) return
                  URL.revokeObjectURL(media.url)
                  setMediaRecords(records => records.filter(record => record.id !== media.id))
                }}>Sil</button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  )

  const Messages = () => (
    <>
      <Header title={role === 'admin' ? 'Tüm Mesajlar' : 'Mesajlar'} />
      <div className="content">
        {conversationMessages.filter(message => role !== 'parent' || message.student === 'Ali Demir').map(m => (
          <div className="card" key={m.id} style={{ borderLeft: m.unread ? '4px solid #2563eb' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="card-title">{m.from} <span aria-hidden="true">→</span> {m.to}</div>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{m.time}</span>
            </div>
            <div className="card-sub">{m.student} · {m.text}</div>
          </div>
        ))}
        <label className="label" htmlFor="message-draft">Yeni mesaj</label>
        <textarea id="message-draft" className="input" rows={3} value={messageDraft} onChange={event => setMessageDraft(event.target.value)} placeholder="Mesajınızı yazın..." />
        <button className="btn btn-primary" style={{ marginTop: 8 }} disabled={!messageDraft.trim()} onClick={() => {
          const from = role === 'parent' ? 'Ayşe Demir' : role === 'teacher' ? 'Ayşe Yılmaz' : 'Müdür'
          const to = role === 'parent' ? 'Ayşe Yılmaz' : role === 'teacher' ? 'Ayşe Demir' : 'Tüm Kullanıcılar'
          setConversationMessages(records => [{ id: Date.now(), from, to, student: 'Ali Demir', text: messageDraft.trim(), time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), unread: false }, ...records])
          setMessageDraft('')
        }}>Gönder</button>
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
        <button className={'nav-item ' + (tab === 'audit' ? 'active' : '')} onClick={() => setTab('audit')}>
          <span className="nav-icon">▤</span> Denetim
        </button>
        <button className={'nav-item ' + (tab === 'teachers' ? 'active' : '')} onClick={() => setTab('teachers')}>
          <span className="nav-icon">👩‍🏫</span> Öğretmen
        </button>
        <button className={'nav-item ' + (tab === 'parents' ? 'active' : '')} onClick={() => setTab('parents')}>
          <span className="nav-icon">👨‍👩‍👧</span> Veliler
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
      {role === 'admin' && tab === 'audit' && <AdminAudit />}
      {tab === 'messages' && <Messages />}
      {tab === 'profile' && <Profile />}

      <BottomNav />
    </div>
  )
}

export default App