interface ReviewCardProps {
  author: string
  location: string
  text: string
}

export function ReviewCard({ author, location, text }: ReviewCardProps) {
  return (
    <div className="review-card" itemScope itemType="https://schema.org/Review">
      <div className="review-stars" aria-label="5 stars">★★★★★</div>
      <p className="review-text" itemProp="reviewBody">{text}</p>
      <p className="reviewer" itemProp="author" itemScope itemType="https://schema.org/Person">
        <span itemProp="name">{author}</span> · {location}
      </p>
    </div>
  )
}
