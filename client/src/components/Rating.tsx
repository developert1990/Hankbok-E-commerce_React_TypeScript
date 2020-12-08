import React from 'react'

export interface RatingProps {
    rating: number;
}

export const Rating: React.FC<RatingProps> = ({ rating }) => {
    return (
        <div className="rating">
            <span> <i className={
                rating >= 1
                    ? "fas fa-star"
                    : rating >= 0.5
                        ? "fa fa-star-half-o"
                        : "fa fa-star-o"
            }></i> </span>

            <span> <i className={
                rating >= 2
                    ? "fas fa-star"
                    : rating >= 1.5
                        ? "fas fa-star-half-alt"
                        : "fas fa-star-o"
            }></i> </span>
            <span> <i className={
                rating >= 3
                    ? "fas fa-star"
                    : rating >= 2.5
                        ? "fas fa-star-half-alt"
                        : "fas fa-star-o"
            }></i> </span>
            <span> <i className={
                rating >= 4
                    ? "fas fa-star"
                    : rating >= 3.5
                        ? "fas fa-star-half-alt"
                        : "fas fa-star-o"
            }></i> </span>
            <span> <i className={
                rating >= 5
                    ? "fas fa-star"
                    : rating >= 4.5
                        ? "fas fa-star-half-alt"
                        : "fas fa-star-o"
            }></i> </span>
        </div>
    )
}
