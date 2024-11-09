import { getModelForClass, prop } from '@typegoose/typegoose'
import { Field } from 'type-graphql'

class Counter {
  @prop({ type: String, required: true, unique: true })
  public model!: string

  @prop({ type: Number, required: true, default: 1 })
  public count!: number
}

export const CounterModel = getModelForClass(Counter)

export async function getNextSequence(modelName: string): Promise<string> {
  const counter = await CounterModel.findOneAndUpdate(
    { model: modelName },
    { $inc: { count: 1 } },
    { new: true, upsert: true },
  )

  return counter!.count?.toString().padStart(10, '0')
}
