import Image from "next/image";

const INSPIRATIONS = [
  {
    name: "Klack",
    desc: "Neat product and website",
    icon: "https://api.dicebear.com/7.x/initials/svg?seed=Klack&backgroundColor=ffffff&textColor=000000",
  },
  {
    name: "Oğuz",
    desc: "Designer with god level skills",
    icon: "https://api.dicebear.com/7.x/notionists/svg?seed=Oguz&backgroundColor=f4f4f5",
  },
  {
    name: "Interface Craft",
    desc: "Amazing resource to learn motion",
    icon: "https://api.dicebear.com/7.x/shapes/svg?seed=InterfaceCraft",
  },
  {
    name: "Shadcn UI",
    desc: "A library that changed my life",
    icon: "https://api.dicebear.com/7.x/initials/svg?seed=SU&backgroundColor=ffffff&textColor=000000",
  },
  {
    name: "Tailwind Plus",
    desc: "Where it all started",
    icon: "https://api.dicebear.com/7.x/initials/svg?seed=TP&backgroundColor=e0f2fe&textColor=0ea5e9",
  },
  {
    name: "Posthog",
    desc: "Analytics tool that has made my life so much easier.",
    icon: "https://api.dicebear.com/7.x/initials/svg?seed=PH&backgroundColor=ffffff&textColor=ea580c",
  },
  {
    name: "Derek Briggs",
    desc: "Designer I look up to",
    icon: "https://api.dicebear.com/7.x/notionists/svg?seed=Derek&backgroundColor=e4e4e7",
  },
  {
    name: "Fireship",
    desc: "All time favourite YouTuber",
    icon: "https://api.dicebear.com/7.x/initials/svg?seed=F&backgroundColor=ffffff&textColor=ea580c",
  },
  {
    name: "Rauno",
    desc: "God level design engineer",
    icon: "https://api.dicebear.com/7.x/notionists/svg?seed=Rauno&backgroundColor=dcfce7",
  },
  {
    name: "Naval",
    desc: "Entrepreneur, philosopher and investor I look up to",
    icon: "https://api.dicebear.com/7.x/notionists/svg?seed=Naval&backgroundColor=f3f4f6",
  },
  {
    name: "Autosend",
    desc: "Landing page that I love, software that I admire.",
    icon: "https://api.dicebear.com/7.x/initials/svg?seed=A&backgroundColor=ffffff&textColor=52525b",
  },
];

export default function InspirationPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-32">
      <div className="max-w-[650px] mx-auto px-6">
        
        {/* Header Text */}
        <div className="mb-14 text-[15px] leading-[1.6] text-zinc-600 flex flex-col gap-5">
          <p>
            A list of all the people that I look up to, websites that I admire, tools that I use and everything else that follows.
          </p>
          <p>
            I will keep on updating this list as I find more inspiration.
          </p>
        </div>

        {/* Inspiration List */}
        <ul className="flex flex-col gap-6">
          {INSPIRATIONS.map((item, i) => (
            <li key={i} className="flex items-center gap-4 group">
              {/* Squircle Icon */}
              <div className="relative w-10 h-10 shrink-0 rounded-[12px] border border-zinc-200/80 bg-white overflow-hidden shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] font-medium text-zinc-800 tracking-tight">
                  {item.name}
                </span>
                <span className="text-zinc-300 text-[10px]">
                  •
                </span>
                <span className="text-[15px] text-zinc-500">
                  {item.desc}
                </span>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
