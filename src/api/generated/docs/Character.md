# Character


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | Unique identifier for the character | [optional] [default to undefined]
**name** | **string** | Character name | [default to undefined]
**level** | **number** | Character level | [optional] [default to 1]
**_class** | **string** | Character class (e.g., Warrior, Mage, Rogue) | [default to undefined]
**createdAt** | **string** | When the character was created | [optional] [default to undefined]
**updatedAt** | **string** | When the character was last updated | [optional] [default to undefined]

## Example

```typescript
import { Character } from './api';

const instance: Character = {
    id,
    name,
    level,
    _class,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
