interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const s = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-14 w-14 text-lg' }[size]
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()

  if (src) {
    return <img src={src} alt={name} className={`${s} rounded-full object-cover`} />
  }
  return (
    <div className={`${s} rounded-full bg-primary-600 flex items-center justify-center font-medium text-white`}>
      {initials}
    </div>
  )
}
