import { gsap, motion } from '@/lib/gsap';
import {
  ConsultingIllustration,
  MobileIllustration,
  WebIllustration,
} from './ServiceIllustrations';

export const serviceIllustrations = {
  web: WebIllustration,
  mobile: MobileIllustration,
  consulting: ConsultingIllustration,
} as const;

/** Card entrance: lift in, draw the illustration strokes, pop the accent shapes. */
export function revealServiceCards(cards: HTMLElement[]) {
  cards.forEach((card, i) => {
    gsap
      .timeline({
        scrollTrigger: { trigger: card, start: 'top 82%' },
        delay: i * motion.stagger.loose,
      })
      .from(card, {
        y: motion.distance.lg,
        opacity: 0,
        duration: motion.duration.normal,
        ease: motion.ease.out,
      })
      .fromTo(
        card.querySelectorAll('.svc-draw'),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: motion.duration.slow,
          stagger: 0.06,
          ease: motion.ease.inOut,
        },
        '-=0.4',
      )
      .from(
        card.querySelectorAll('.svc-pop'),
        {
          scale: 0,
          transformOrigin: '50% 50%',
          duration: 0.5,
          stagger: motion.stagger.tight,
          ease: motion.ease.pop,
        },
        '-=0.7',
      );
  });
}
