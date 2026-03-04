import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './Hero.module.css'

const letterVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: 0.5 + i * 0.07, duration: 0.7, ease: [.4, 0, .2, 1] }
    }),
}

const BOSS = 'Boss'.split('')
const HOUSE = 'HOUSE'.split('')

export default function Hero() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

    // Parallax transforms
    const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])
    const opacity = useTransform(scrollYProgress, [0, .6], [1, 0])

    return (
        <section className={styles.hero} id="home" ref={ref}>
            {/* Continuous background */}
            <div className={styles.bg} />
            <div className={styles.overlay} />

            {/* Floating particles */}
            <div className={styles.particles} aria-hidden="true">
                {[...Array(18)].map((_, i) => (
                    <motion.span
                        key={i}
                        className={styles.particle}
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ y: [0, -24, 0], opacity: [.15, .6, .15] }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 4,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            {/* Gold horizontal lines */}
            <motion.div
                className={styles.lineTop}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: .2, ease: [.4, 0, .2, 1] }}
            />
            <motion.div
                className={styles.lineBottom}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: .3, ease: [.4, 0, .2, 1] }}
            />

            {/* Content */}
            <motion.div className={styles.content} style={{ y: contentY, opacity }}>
                {/* Logo */}
                <motion.div
                    className={styles.logoWrap}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: .9, ease: [.34, 1.56, .64, 1] }}
                >
                    <img src="/Boss_logo.jpeg" alt="Boss House Logo" className={styles.logo} />
                    <motion.div
                        className={styles.logoRing}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    />
                </motion.div>

                <motion.p
                    className={styles.eyebrow}
                    initial={{ opacity: 0, letterSpacing: '0.05em' }}
                    animate={{ opacity: 1, letterSpacing: '0.3em' }}
                    transition={{ duration: 1, delay: .4 }}
                >
                    Est. 2020 &nbsp;·&nbsp; Premium Barber House
                </motion.p>

                {/* Animated title */}
                <h1 className={styles.title}>
                    <span className={styles.titleRow}>
                        {BOSS.map((l, i) => (
                            <motion.span
                                key={i} custom={i}
                                variants={letterVariants}
                                initial="hidden"
                                animate="visible"
                                className={styles.letter}
                            >{l}</motion.span>
                        ))}
                    </span>
                    <span className={`${styles.titleRow} ${styles.gold}`}>
                        {HOUSE.map((l, i) => (
                            <motion.span
                                key={i} custom={i + 4}
                                variants={letterVariants}
                                initial="hidden"
                                animate="visible"
                                className={styles.letter}
                            >{l}</motion.span>
                        ))}
                    </span>
                </h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, letterSpacing: '0.1em' }}
                    animate={{ opacity: 1, letterSpacing: '0.5em' }}
                    transition={{ duration: 1, delay: 1.1 }}
                >
                    BARBEARIA
                </motion.p>

                <motion.p
                    className={styles.tagline}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .7, delay: 1.3 }}
                >
                    Onde cada corte conta uma história.<br />
                    Tradição, estilo e precisão no detalhe.
                </motion.p>

                <motion.div
                    className={styles.buttons}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .7, delay: 1.5 }}
                >
                    <a href="#booking" className={styles.btnPrimary} data-cursor>
                        <span>Agendar Agora</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>

                </motion.div>
            </motion.div>


        </section>
    )
}
