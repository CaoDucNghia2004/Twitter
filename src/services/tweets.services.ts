import { ObjectId, WithId } from 'mongodb'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from '~/services/database.services'

class TweetsService {
  // async checkAndCreateHashtags(hashtags: string[]) {
  //   const hashtagDocuemts = await Promise.all(
  //     hashtags.map((hashtag) => {
  //       // Tìm hashtag trong database, nếu có thì lấy, không thì tạo mới
  //       return databaseService.hashtags.findOneAndUpdate(
  //         { name: hashtag },
  //         {
  //           $setOnInsert: new Hashtag({ name: hashtag })
  //         },
  //         {
  //           upsert: true,
  //           returnDocument: 'after'
  //         }
  //       )
  //     })
  //   )
  //   // return hashtagDocuemts.map((hashtag) => (hashtag.value as WithId<Hashtag>)._id)
  //   return hashtagDocuemts.map((hashtag) => (hashtag as any).value._id)
  // }

  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtags.map(async (hashtag) => {
        // Upsert hashtag
        await databaseService.hashtags.updateOne(
          { name: hashtag },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          { upsert: true }
        )

        // Tìm lại hashtag để lấy _id
        return await databaseService.hashtags.findOne({ name: hashtag })
      })
    )

    return hashtagDocuments.map((hashtag) => hashtag!._id)
  }

  async createTweet(user_id: string, body: TweetRequestBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
}

const tweetsService = new TweetsService()
export default tweetsService
