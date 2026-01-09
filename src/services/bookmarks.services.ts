import { ObjectId, WithId } from 'mongodb'
import Bookmark from '~/models/schemas/Bookmark.schema'

import databaseService from '~/services/database.services'

class BookmarkService {
  // async bookmarkTweet(user_id: string, tweetId: string) {
  //   const result = await databaseService.bookmarks.findOneAndUpdate(
  //     {
  //       user_id: new ObjectId(user_id),
  //       tweet_id: new ObjectId(tweetId)
  //     },
  //     {
  //       $setOnInsert: new Bookmark({
  //         user_id: new ObjectId(user_id),
  //         tweet_id: new ObjectId(tweetId)
  //       })
  //     },
  //     {
  //       upsert: true,
  //       returnDocument: 'after'
  //     }
  //   )
  //   return result.value as WithId<Bookmark>
  // }
  async bookmarkTweet(user_id: string, tweet_id: string) {
    await databaseService.bookmarks.updateOne(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      { upsert: true }
    )

    return (await databaseService.bookmarks.findOne({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })) as WithId<Bookmark>
  }

  async unbookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
