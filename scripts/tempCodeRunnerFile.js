const updated_reviews = reviews.map((review) => {
      return {
        ...review,
        questions: review.questions.map((q) => {
          return { ...q, id: question_id_dictionary[q.id] }
        }),
      }
    })

    for (const review of updated_reviews) {
      try {
        const result = await review_collection.updateOne(
          { _id: new ObjectId(review._id) },
          {
            $set: {
              questions: review.questions,
            },
          }
        )
        console.log(
          `Updated review ${result._id}: ${result.modifiedCount} document modified`
        )
      } catch (error) {
        console.error(`Error creating question ${review._id}:`, error)
      }
    }