export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout sem header e footer para páginas públicas de timeline
  // Isso permite que a timeline seja um link próprio da pessoa
  // O header e footer do layout principal não serão renderizados aqui
  return <>{children}</>
}

