import Image from "next/image";
import type { KkScreen } from "../data/kk";

/**
 * A phone around one app screen: a flat coal frame, no shadow, the screen
 * inside. The screens are made-up demo data (made-up trucks and names), cut
 * small, so each costs about 25 kB. `priority` is for the one above the fold.
 */
export default function PhoneFrame({
  screen,
  alt,
  priority = false,
  sizes = "(min-width: 768px) 300px, 70vw",
  className = "",
}: {
  screen: KkScreen;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={"overflow-hidden rounded-[2.2rem] bg-kk-coal p-[7px] " + className}>
      <Image
        src={screen.src}
        width={screen.width}
        height={screen.height}
        alt={alt}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        className="block h-auto w-full rounded-[1.75rem]"
        draggable={false}
      />
    </div>
  );
}
