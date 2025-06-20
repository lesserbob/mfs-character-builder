# Stats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | Unique identifier for the stats | [optional] [default to undefined]
**characterId** | **number** | ID of the character these stats belong to | [optional] [default to undefined]
**strength** | **number** | Strength attribute | [optional] [default to 10]
**dexterity** | **number** | Dexterity attribute | [optional] [default to 10]
**constitution** | **number** | Constitution attribute | [optional] [default to 10]
**intelligence** | **number** | Intelligence attribute | [optional] [default to 10]
**wisdom** | **number** | Wisdom attribute | [optional] [default to 10]
**charisma** | **number** | Charisma attribute | [optional] [default to 10]
**createdAt** | **string** | When the stats were created | [optional] [default to undefined]
**updatedAt** | **string** | When the stats were last updated | [optional] [default to undefined]

## Example

```typescript
import { Stats } from './api';

const instance: Stats = {
    id,
    characterId,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
