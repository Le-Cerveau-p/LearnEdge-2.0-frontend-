type QuizCardProps = {
  title?: string
  description?: string
}

export default function QuizCard({ title = 'Quiz Title', description = 'Quiz description' }: QuizCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}
