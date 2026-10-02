import { useState } from 'react';
import './StarRating.css';

// value 0 means "not rated"; size is 'sm', 'md' or 'lg'
export default function StarRating({ value = 0, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);

  const displayValue = hovered || value;

  return (
    <div
      className={`star-rating star-rating--${size} ${readonly ? 'star-rating--readonly' : ''}`}
      onMouseLeave={() => !readonly && setHovered(0)}
      id="star-rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= displayValue ? 'star--filled' : 'star--empty'}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          disabled={readonly}
          id={`star-${star}`}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
