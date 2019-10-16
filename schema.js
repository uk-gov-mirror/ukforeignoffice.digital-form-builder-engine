const joi = require('joi')

const sectionsSchema = joi.object().keys({
  name: joi.string().required(),
  title: joi.string().required()
})

const conditionsSchema = joi.object().keys({
  name: joi.string().required(),
  value: joi.string().required()
})

const localisedString = joi.alternatives().try([joi.object({ a: joi.any() }).unknown(), joi.string().allow('')])

const componentSchema = joi.object().keys({
  type: joi.string().required(),
  name: joi.string(),
  title: localisedString,
  hint: localisedString.optional(),
  options: joi.object().default({}),
  schema: joi.object().default({})
}).unknown(true)

const nextSchema = joi.object().keys({
  path: joi.string().required(),
  if: joi.string()
})

const pageSchema = joi.object().keys({
  path: joi.string().required(),
  title: localisedString,
  condition: joi.string(),
  section: joi.string(),
  controller: joi.string(),
  components: joi.array().required().items(componentSchema),
  next: joi.array().items(nextSchema)
})

const listItemSchema = joi.object().keys({
  text: localisedString,
  value: joi.alternatives().try(joi.number(), joi.string()),
  description: localisedString.optional(),
  conditional: joi.object().keys({
    components: joi.array().required().items(componentSchema.unknown(true)).unique('name')
  })
})

const listSchema = joi.object().keys({
  name: joi.string().required(),
  title: localisedString,
  type: joi.string().required().valid('string', 'number'),
  items: joi.array().items(listItemSchema)
})

const feeSchema = joi.object().keys({
  name: joi.string().required(),
  amount: joi.number().required()
})

const schema = joi.object().required().keys({
  pages: joi.array().required().items(pageSchema).unique('path'),
  sections: joi.array().items(sectionsSchema).unique('name').required(),
  conditions: joi.array().items(conditionsSchema).unique('name'),
  lists: joi.array().items(listSchema).unique('name'),
  fee: joi.array().items(feeSchema).unique('name')
})

module.exports = schema
