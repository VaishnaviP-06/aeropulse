import gsap from "gsap";

interface IntroRefs {
  aircraft: React.RefObject<HTMLImageElement | null>;
  flash: React.RefObject<HTMLDivElement | null>;
  logo: React.RefObject<HTMLDivElement | null>;
}

export function createIntroTimeline(
  refs: IntroRefs,
  onComplete: () => void
) {
  const tl = gsap.timeline({ onComplete });

  tl.fromTo(
    refs.aircraft.current,
    {
      opacity: 0,
      scale: 0.6,
      y: 60,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    }
  )

    .to(refs.aircraft.current, {
      scale: 2.8,
      duration: 1.2,
      ease: "power2.in",
    })

    .to(
      refs.flash.current,
      {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      },
      "-=0.1"
    )

    .fromTo(
      refs.logo.current,
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }
    )

    .to({}, { duration: 0.3 });

  return tl;
}