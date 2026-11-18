export default function AnnouncementBar({ enabled, messages }) {
  if (!enabled || messages.length === 0) return null

  const repeatedMessages = [...messages, ...messages, ...messages, ...messages, ...messages, ...messages, ...messages, ...messages]

  return (
    <div
      dir="rtl"
      className="relative overflow-hidden border-b border-black/10 bg-white py-2.5 text-black shadow-sm transition-colors duration-300 dark:border-[#D4AF37]/40 dark:bg-[#070707] dark:text-white"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent dark:from-[#070707]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent dark:from-[#070707]" />

      <div className="announcement-marquee whitespace-nowrap text-sm font-semibold tracking-[0.12em] md:text-[15px]">
        {repeatedMessages.map((message, index) => (
          <span key={index} className="mx-10 inline-flex items-center gap-4">
            <span aria-hidden="true" className="text-[#D4AF37]">✦</span>
            <span>{message}</span>
          </span>
        ))}
      </div>
    </div>
  )
}