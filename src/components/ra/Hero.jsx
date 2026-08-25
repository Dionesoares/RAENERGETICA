import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { waQuoteLink } from "@/lib/whatsapp";

const FALLBACK_BANNERS = [
  {
    id: "fallback-powerbox",
    image_url: "/banners/powerbox.jpg",
    caption: "Cansado de ficar sem energia? Chegou o Powerbox",
  },
  {
    id: "fallback-locacao",
    image_url: "/banners/locacao.jpg",
    caption: "Locação de geradores para todos os segmentos — 11 anos entregando agilidade e confiança",
  },
];

const HIDDEN_BANNER_URLS = ["/banners/home-principal.png"];

function isVisibleBanner(banner) {
  const url = String(banner?.image_url || "");
  return banner?.active !== false && url && !HIDDEN_BANNER_URLS.some((hidden) => url.includes(hidden));
}

export default function Hero() {
  const [banners, setBanners] = useState(FALLBACK_BANNERS);
  const [selected, setSelected] = useState(0);
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: false }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28, align: "start" }, [autoplay.current]);

  useEffect(() => {
    let active = true;
    base44.entities.Banner.list("sort_order")
      .then((list) => {
        const visible = (list || []).filter(isVisibleBanner);
        if (!active) return;
        if (visible.length >= 2) {
          setBanners(visible);
          return;
        }
        if (visible.length === 1) {
          const extra = FALLBACK_BANNERS.filter((item) => item.image_url !== visible[0].image_url);
          setBanners([...visible, ...extra]);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    emblaApi.reInit();
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    autoplay.current.play();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, banners, onSelect]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const restart = () => {
      emblaApi.reInit();
      autoplay.current.play();
    };
    const images = emblaApi.rootNode().querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", restart);
    });
    return () => {
      images.forEach((img) => img.removeEventListener("load", restart));
    };
  }, [emblaApi, banners]);

  const currentCaption = banners[selected]?.caption;
  const showControls = banners.length > 1;

  return (
    <section id="top" className="relative bg-primary">
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {banners.map((banner) => (
              <div key={banner.id} className="relative min-w-0 shrink-0 grow-0 basis-full">
                <div className="relative h-[280px] w-full overflow-hidden bg-[#0b1c3d] sm:h-[440px] md:h-[580px] lg:h-[740px] xl:h-[860px]">
                  <img
                    src={banner.image_url}
                    alt={banner.caption || "Banner RA Energética"}
                    className="h-full w-full object-contain object-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {showControls && (
          <>
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary shadow sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Próximo banner"
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary shadow sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={`Ir para o banner ${index + 1}`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    selected === index ? "w-8 bg-white" : "w-2.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-primary px-4 py-4 sm:px-6 sm:py-5">
        {currentCaption ? (
          <p className="mx-auto mb-4 max-w-4xl text-center text-xs font-bold uppercase tracking-wide text-white sm:text-sm lg:text-base">
            {currentCaption}
          </p>
        ) : null}
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            href={waQuoteLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-sm font-bold uppercase text-primary"
          >
            Solicite um orçamento
          </a>
          <a
            href="#geradores"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/40 px-6 text-sm font-bold uppercase text-white"
          >
            Nossos geradores
          </a>
        </div>
      </div>
    </section>
  );
}
