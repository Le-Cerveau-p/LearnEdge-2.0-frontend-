type QuestionCardProps = {
  question?: string
}

export default function QuestionCard({ question = 'Question prompt goes here' }: QuestionCardProps) {
  return (
    <section>
      <h2>{question}</h2>
    </section>
  )
}
