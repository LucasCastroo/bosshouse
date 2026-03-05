import { useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './Hero.module.css'


export default function Hero() {
    const ref = useRef(null)
    const videoRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

    // Parallax transforms
    const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])
    const opacity = useTransform(scrollYProgress, [0, .6], [1, 0])

    // Fade-in suave quando o vídeo estiver pronto
    const handleCanPlay = useCallback(() => {
        const v = videoRef.current
        if (v) v.classList.add(styles.videoReady)
    }, [])

    // Loop suave: fade-out perto do final, depois reseta
    const handleTimeUpdate = useCallback(() => {
        const v = videoRef.current
        if (!v || !v.duration) return
        const remaining = v.duration - v.currentTime
        if (remaining <= 1.5 && !v.dataset.fading) {
            v.dataset.fading = 'true'
            v.classList.add(styles.videoFadeOut)
            setTimeout(() => {
                v.currentTime = 0
                v.classList.remove(styles.videoFadeOut)
                delete v.dataset.fading
            }, 1400)
        }
    }, [])


    return (
        <section className={styles.hero} id="home" ref={ref}>
            {/* Desktop background */}
            <div className={styles.bg} />

            {/* Mobile video background */}
            <video
                ref={videoRef}
                className={styles.videoBg}
                src="/background.mp4"
                autoPlay
                muted
                loop={false}
                playsInline
                preload="auto"
                onCanPlay={handleCanPlay}
                onTimeUpdate={handleTimeUpdate}
            />

            {/* Blur layer (mobile only) */}
            <div className={styles.blurLayer} />

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
                        <span>Agendar Hórario</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>

                </motion.div>
            </motion.div>


        </section>
    )
}
