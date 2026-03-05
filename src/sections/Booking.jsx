import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Booking.module.css'

/* ─── Categorias de Serviços ───────────────── */
const SERVICE_CATEGORIES = [
    {
        id: 'barba', label: 'Barba', icon: '🪒',
        services: [
            { value: 'Barba', label: 'Barba', price: 'R$ 50,00' },
            { value: 'Barbaterapia', label: 'Barbaterapia', price: 'R$ 100,00' },
            { value: 'Pigmentação', label: 'Pigmentação', price: 'R$ 60,00' },
        ],
    },
    {
        id: 'combos', label: 'Combos', icon: '👑',
        services: [
            { value: 'Corte Duplo', label: 'Corte Duplo', price: 'R$ 120,00' },
            { value: 'Corte e Barba', label: 'Corte e Barba', price: 'R$ 110,00' },
            { value: 'Corte e Coloração', label: 'Corte e Coloração', price: 'R$ 160,00' },
            { value: 'Corte e Selagem', label: 'Corte e Selagem', price: 'R$ 160,00' },
            { value: 'Corte e Sobrancelha', label: 'Corte e Sobrancelha', price: 'R$ 85,00' },
            { value: 'Corte, Barba e Pigmentação', label: 'Corte, Barba e Pigmentação', price: 'R$ 170,00' },
            { value: 'Corte, Barba e Selagem', label: 'Corte, Barba e Selagem', price: 'R$ 210,00' },
            { value: 'Corte, Barba e Sobrancelha', label: 'Corte, Barba e Sobrancelha', price: 'R$ 135,00' },
            { value: 'Máquina + Barba', label: 'Máquina + Barba', price: 'R$ 80,00' },
        ],
    },
    {
        id: 'corte', label: 'Corte', icon: '✂',
        services: [
            { value: 'Botox', label: 'Botox', price: 'R$ 100,00' },
            { value: 'Coloração', label: 'Coloração', price: 'R$ 100,00' },
            { value: 'Corte Feminino', label: 'Corte Feminino', price: 'R$ 70,00' },
            { value: 'Corte', label: 'Corte', price: 'R$ 60,00' },
            { value: 'Desondulação', label: 'Desondulação', price: 'R$ 60,00' },
            { value: 'Hidratação', label: 'Hidratação', price: 'R$ 50,00' },
            { value: 'Máquina (zero)', label: 'Máquina (zero)', price: 'R$ 30,00' },
            { value: 'Máquina', label: 'Máquina', price: 'R$ 30,00' },
            { value: 'Penteado', label: 'Penteado', price: 'R$ 25,00' },
            { value: 'Pezinho', label: 'Pezinho', price: 'R$ 25,00' },
        ],
    },
    {
        id: 'sobrancelha', label: 'Sobrancelha', icon: '💆',
        services: [
            { value: 'Sobrancelha', label: 'Sobrancelha', price: 'R$ 25,00' },
        ],
    },
]

// Lista plana para lookup
const SERVICES_FLAT = SERVICE_CATEGORIES.flatMap(c =>
    c.services.map(s => ({ ...s, categoryIcon: c.icon }))
)

const PROS = [
    { value: 'Qualquer disponível', role: 'Sem preferência', photo: null },
    { value: 'Theylo Fernandes', role: 'Barber Professional', photo: '/theylo.jpeg', photoPosition: 'center top' },
    { value: 'Jhonatan Messias', role: 'Barber Professional', photo: '/jhonatan.jpeg' },
    { value: 'Breno Barbosa', role: 'Barber Professional', photo: '/breno.jpeg' },
    { value: 'Matheus Barbosa', role: 'Barber Professional', photo: '/matheus.jpeg' },
    { value: 'Stewer Gabriel', role: 'Barber Professional', photo: '/stewer.jpeg' },
]

// Gera slots de 30 em 30 min — seg-sex: 09h–19h | sáb: 09h–17h | dom: fechado
function getTimeSlots(dateStr) {
    if (!dateStr) return []
    const date = new Date(dateStr + 'T12:00:00')
    const dow = date.getDay()
    if (dow === 0) return []
    const endHour = dow === 6 ? 17 : 19
    const slots = []
    for (let h = 9; h < endHour; h++) {
        slots.push(`${String(h).padStart(2, '0')}:00`)
        slots.push(`${String(h).padStart(2, '0')}:30`)
    }
    slots.push(`${String(endHour).padStart(2, '0')}:00`)
    return slots
}

const today = new Date()
const MIN_DATE = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString().split('T')[0]

const INITIAL = {
    name: '', service: [], professional: '',
    date: '', time: '', whatsapp: '5563991030755',
}

/* ─── Floating Label Input ──────────────────── */
function FloatInput({ id, label, type = 'text', value, onChange, error, min, autoComplete }) {
    return (
        <div className={`${styles.floatGroup} ${value ? styles.filled : ''} ${error ? styles.hasError : ''}`}>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                min={min}
                autoComplete={autoComplete}
                className={styles.floatInput}
                placeholder=" "
            />
            <label htmlFor={id} className={styles.floatLabel}>{label}</label>
            <AnimatePresence>
                {error && (
                    <motion.span
                        className={styles.errMsg}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        ⚠ {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    )
}

/* ─── Custom Select ─────────────────────────── */
function CustomSelect({ id, label, value, onChange, error, options, renderOption }) {
    const [open, setOpen] = useState(false)
    const selected = options.find(o => o.value === value)

    const pick = (val) => { onChange(val); setOpen(false) }

    return (
        <div
            className={`${styles.floatGroup} ${value ? styles.filled : ''} ${error ? styles.hasError : ''}`}
            style={{ position: 'relative', userSelect: 'none' }}
        >
            <button
                type="button"
                id={id}
                className={`${styles.floatInput} ${styles.selectBtn}`}
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {selected ? renderOption(selected, true) : <span style={{ opacity: 0 }}>_</span>}
                <motion.svg
                    className={styles.chevron}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: .25 }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                    <path d="M6 9l6 6 6-6" />
                </motion.svg>
            </button>
            <label htmlFor={id} className={styles.floatLabel}>{label}</label>

            <AnimatePresence>
                {open && (
                    <>
                        <div className={styles.backdrop} onClick={() => setOpen(false)} />
                        <motion.ul
                            role="listbox"
                            className={styles.dropdown}
                            initial={{ opacity: 0, y: -8, scaleY: .92 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ opacity: 0, y: -8, scaleY: .92 }}
                            transition={{ duration: .2, ease: [.4, 0, .2, 1] }}
                        >
                            {options.map((o, i) => (
                                <motion.li
                                    key={o.value}
                                    role="option"
                                    aria-selected={value === o.value}
                                    className={`${styles.dropItem} ${value === o.value ? styles.dropItemActive : ''}`}
                                    onClick={() => pick(o.value)}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * .04 }}
                                >
                                    {renderOption(o, false)}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.span
                        className={styles.errMsg}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        ⚠ {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    )
}

/* ─── Service Tabs (multi-select) ────────────── */
function ServiceTabs({ value, onChange, error }) {
    const [activeTab, setActiveTab] = useState(SERVICE_CATEGORIES[0].id)
    const currentCategory = SERVICE_CATEGORIES.find(c => c.id === activeTab)

    const toggle = (svcValue) => {
        onChange(prev =>
            prev.includes(svcValue)
                ? prev.filter(v => v !== svcValue)
                : [...prev, svcValue]
        )
    }

    return (
        <div className={styles.serviceTabs}>
            <p className={styles.timeLabel}>
                Serviço <span className={styles.req}>*</span>
                {value.length > 0 && (
                    <span className={styles.selectedCount}>{value.length} selecionado{value.length > 1 ? 's' : ''}</span>
                )}
            </p>

            {/* Tab pills */}
            <div className={styles.tabList}>
                {SERVICE_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        type="button"
                        className={`${styles.tabBtn} ${activeTab === cat.id ? styles.tabBtnActive : ''}`}
                        onClick={() => setActiveTab(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Service list */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className={styles.svcList}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: .2 }}
                >
                    {currentCategory.services.map((svc, i) => {
                        const isSelected = value.includes(svc.value)
                        return (
                            <motion.button
                                key={svc.value}
                                type="button"
                                className={`${styles.svcRow} ${isSelected ? styles.svcRowActive : ''}`}
                                onClick={() => toggle(svc.value)}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * .04 }}
                                whileTap={{ scale: .98 }}
                            >
                                <span className={styles.svcRowName}>{svc.label}</span>
                                <span className={styles.svcRowPrice}>{svc.price}</span>
                                <span className={`${styles.svcCheckbox} ${isSelected ? styles.svcCheckboxActive : ''}`}>
                                    {isSelected && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        >
                                            ✓
                                        </motion.span>
                                    )}
                                </span>
                            </motion.button>
                        )
                    })}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.span className={styles.errMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        ⚠ {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    )
}

/* ─── Time Grid ─────────────────────────────── */
function TimeGrid({ value, onChange, error, date }) {
    const slots = getTimeSlots(date)
    const dateObj = date ? new Date(date + 'T12:00:00') : null
    const isSunday = dateObj && dateObj.getDay() === 0

    return (
        <div className={styles.timeSection}>
            <p className={styles.timeLabel}>Horário <span className={styles.req}>*</span></p>
            {isSunday ? (
                <p className={styles.closedMsg}>🚫 Fechado aos domingos</p>
            ) : slots.length === 0 ? (
                <p className={styles.closedMsg}>Selecione uma data para ver os horários</p>
            ) : (
                <div className={styles.timeGrid}>
                    {slots.map(t => (
                        <motion.button
                            key={t}
                            type="button"
                            className={`${styles.timeBtn} ${value === t ? styles.timeBtnActive : ''}`}
                            onClick={() => onChange(t)}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: .95 }}
                        >
                            {t}
                        </motion.button>
                    ))}
                </div>
            )}
            <AnimatePresence>
                {error && (
                    <motion.span className={styles.errMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        ⚠ {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    )
}

/* ─── Main Component ────────────────────────── */
export default function Booking() {
    const [form, setForm] = useState(INITIAL)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const set = (key, val) => {
        if (typeof val === 'function') {
            setForm(f => ({ ...f, [key]: val(f[key]) }))
        } else {
            setForm(f => ({ ...f, [key]: val }))
        }
        setErrors(e => ({ ...e, [key]: '' }))
    }

    const validate = () => {
        const e = {}
        if (!form.name.trim()) e.name = 'Informe seu nome.'
        if (!form.service.length) e.service = 'Escolha pelo menos um serviço.'
        if (!form.professional) e.professional = 'Escolha um profissional.'
        if (!form.date) e.date = 'Informe a data.'
        if (!form.time) e.time = 'Escolha um horário.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const submit = (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        const [y, m, d] = form.date.split('-')
        const number = form.whatsapp.replace(/\D/g, '')
        const svcList = form.service.join(', ')

        const msg =
            `Olá! Gostaria de agendar na *Boss House* 💈\n\n` +
            `👤 *Nome:* ${form.name}\n` +
            `✂ *Serviço(s):* ${svcList}\n` +
            `💈 *Profissional:* ${form.professional}\n` +
            `📅 *Data:* ${d}/${m}/${y}\n` +
            `🕐 *Horário:* ${form.time}\n\n` +
            `Aguardo a confirmação! 🙏`

        setTimeout(() => {
            window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank')
            setLoading(false)
            setSent(true)
            setForm(INITIAL)
            setTimeout(() => setSent(false), 5000)
        }, 600)
    }

    // Serviços selecionados para preview no painel esquerdo
    const selectedServices = SERVICES_FLAT.filter(s => form.service.includes(s.value))

    return (
        <section className={styles.booking} id="booking">
            {/* BG */}
            <div className={styles.bg} />
            <div className={styles.overlay} />

            <div className={styles.wrapper}>
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: .1 }}
                    transition={{ duration: .75, ease: [.4, 0, .2, 1] }}
                >
                    {/* ── Left panel ── */}
                    <div className={styles.panelLeft}>
                        <div className={styles.panelTop}>
                            <img src="/Boss_logo.jpeg" alt="Boss House" className={styles.panelLogo} />
                            <h2 className={styles.panelTitle}>Agende seu<br /><span>Horário</span></h2>
                            <p className={styles.panelSub}>Rápido e sem complicação. Preencha ao lado e falaremos pelo WhatsApp.</p>
                        </div>

                        {/* Info blocks */}
                        <div className={styles.infoList}>
                            {[
                                { icon: '📍', label: 'Endereço', val: 'Quadra 103 Norte - Rua de Pedestre NO 3, 20 - Plano Diretor Norte, Palmas - TO' },
                                { icon: '🕐', label: 'Horários', val: 'Seg–Sex: 09h às 19h  |  Sáb: 09h às 17h' },
                                { icon: '📞', label: 'Telefone', val: '(63) 9 9103-0755' },
                            ].map(info => (
                                <div key={info.label} className={styles.infoItem}>
                                    <span className={styles.infoIcon}>{info.icon}</span>
                                    <div>
                                        <span className={styles.infoLabel}>{info.label}</span>
                                        <span className={styles.infoVal}>{info.val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Selected services preview */}
                        <AnimatePresence>
                            {selectedServices.length > 0 && (
                                <motion.div
                                    className={styles.servicePreview}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: .3 }}
                                >
                                    <span className={styles.previewIcon}>✂</span>
                                    <div className={styles.previewServiceList}>
                                        {selectedServices.map(s => (
                                            <span key={s.value} className={styles.previewServiceItem}>
                                                <span className={styles.previewName}>{s.label}</span>
                                                <span className={styles.previewPrice}>{s.price}</span>
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Right panel (form) ── */}
                    <div className={styles.panelRight}>
                        <form className={styles.form} onSubmit={submit} noValidate>

                            {/* Name */}
                            <FloatInput
                                id="name" label="Nome Completo"
                                value={form.name} onChange={e => set('name', e.target.value)}
                                error={errors.name} autoComplete="name"
                            />

                            {/* Service tabs */}
                            <ServiceTabs
                                value={form.service}
                                onChange={v => set('service', v)}
                                error={errors.service}
                            />

                            {/* Professional */}
                            <CustomSelect
                                id="professional" label="Profissional Desejado"
                                value={form.professional} onChange={v => set('professional', v)}
                                error={errors.professional} options={PROS}
                                renderOption={(o, compact) => (
                                    <span className={styles.proOption}>
                                        {o.photo ? (
                                            <img
                                                src={o.photo}
                                                alt={o.value}
                                                className={`${styles.proPhoto} ${compact && form.professional === o.value ? styles.proPhotoSelected : ''}`}
                                                style={{ objectPosition: o.photoPosition || 'center center' }}
                                            />
                                        ) : (
                                            <span className={styles.proInitials}>
                                                {o.value.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                            </span>
                                        )}
                                        <span>
                                            <span className={styles.proName}>{o.value}</span>
                                            {!compact && <span className={styles.proRole}>{o.role}</span>}
                                        </span>
                                    </span>
                                )}
                            />

                            {/* Date */}
                            <div className={styles.dateWrapper}>
                                <FloatInput
                                    id="date" label="Data" type="date"
                                    value={form.date} onChange={e => set('date', e.target.value)}
                                    error={errors.date} min={MIN_DATE}
                                />
                                <div className={styles.dateIconWrapper}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.calendarIcon}>
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                            </div>

                            {/* Time grid */}
                            <TimeGrid
                                value={form.time} onChange={v => set('time', v)}
                                error={errors.time} date={form.date}
                            />

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                className={`${styles.submitBtn} ${sent ? styles.submitSent : ''}`}
                                disabled={loading || sent}
                                whileHover={!sent && !loading ? { scale: 1.02 } : {}}
                                whileTap={!sent && !loading ? { scale: .97 } : {}}
                            >
                                <AnimatePresence mode="wait">
                                    {sent ? (
                                        <motion.span key="sent"
                                            initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                            className={styles.btnInner}
                                        >
                                            <span className={styles.checkmark}>✓</span>
                                            WhatsApp aberto com sucesso!
                                        </motion.span>
                                    ) : loading ? (
                                        <motion.span key="load"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className={styles.btnInner}
                                        >
                                            <span className={styles.spinner} />
                                            Abrindo WhatsApp...
                                        </motion.span>
                                    ) : (
                                        <motion.span key="idle"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className={styles.btnInner}
                                        >
                                            <WppIcon />
                                            Enviar pelo WhatsApp
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

function WppIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.525 5.845L.057 23.755l6.07-1.57A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.015-1.376l-.36-.213-3.735.967.998-3.625-.235-.373A9.818 9.818 0 1 1 12 21.818z" />
        </svg>
    )
}
