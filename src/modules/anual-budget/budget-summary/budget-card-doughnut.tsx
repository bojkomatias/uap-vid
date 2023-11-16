import React from 'react'

const BudgetCardDoughnut = ({ percentage }: { percentage: string }) => {
    const strokeDasharray = `${percentage} 100`
    return (
        <div className="absolute -bottom-1 right-1 h-16 w-16">
            <svg className="h-full w-full" viewBox="0 0 24 24" fill="none">
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#E2E8F0" // Change this to the background color
                    strokeWidth="3" // Change this to adjust the thickness of the doughnut
                ></circle>
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#10B981" // Change this to the foreground color
                    strokeWidth="2"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                ></circle>
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize=".25rem"
                    fill="#333" // Color of the text
                >
                    {percentage}%
                </text>
            </svg>
        </div>
    )
}

export default BudgetCardDoughnut
