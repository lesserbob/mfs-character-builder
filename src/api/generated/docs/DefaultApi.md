# DefaultApi

All URIs are relative to *http://localhost:3001*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCharacter**](#createcharacter) | **POST** /characters | Create a new character|
|[**createCharacterStats**](#createcharacterstats) | **POST** /characters/{id}/stats | Create character stats|
|[**deleteCharacter**](#deletecharacter) | **DELETE** /characters/{id} | Delete character|
|[**getCharacterById**](#getcharacterbyid) | **GET** /characters/{id} | Get character by ID|
|[**getCharacterStats**](#getcharacterstats) | **GET** /characters/{id}/stats | Get character stats|
|[**getCharacters**](#getcharacters) | **GET** /characters | Get all characters|
|[**updateCharacter**](#updatecharacter) | **PUT** /characters/{id} | Update character|

# **createCharacter**
> Character createCharacter(createCharacterRequest)

Create a new character with basic information

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateCharacterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createCharacterRequest: CreateCharacterRequest; //

const { status, data } = await apiInstance.createCharacter(
    createCharacterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCharacterRequest** | **CreateCharacterRequest**|  | |


### Return type

**Character**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Character created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createCharacterStats**
> Stats createCharacterStats(createStatsRequest)

Create new stats for a character

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateStatsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //Character ID (default to undefined)
let createStatsRequest: CreateStatsRequest; //

const { status, data } = await apiInstance.createCharacterStats(
    id,
    createStatsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createStatsRequest** | **CreateStatsRequest**|  | |
| **id** | [**number**] | Character ID | defaults to undefined|


### Return type

**Stats**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Stats created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteCharacter**
> deleteCharacter()

Delete a character and all associated data

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //Character ID (default to undefined)

const { status, data } = await apiInstance.deleteCharacter(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Character ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Character deleted successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCharacterById**
> Character getCharacterById()

Retrieve a specific character by their ID

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //Character ID (default to undefined)

const { status, data } = await apiInstance.getCharacterById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Character ID | defaults to undefined|


### Return type

**Character**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Character found |  -  |
|**404** | Character not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCharacterStats**
> Array<Stats> getCharacterStats()

Retrieve all stats for a specific character

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //Character ID (default to undefined)

const { status, data } = await apiInstance.getCharacterStats(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Character ID | defaults to undefined|


### Return type

**Array<Stats>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Character stats |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCharacters**
> Array<Character> getCharacters()

Retrieve a list of all characters

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getCharacters();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Character>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of characters |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCharacter**
> Character updateCharacter(updateCharacterRequest)

Update an existing character\'s information

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateCharacterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //Character ID (default to undefined)
let updateCharacterRequest: UpdateCharacterRequest; //

const { status, data } = await apiInstance.updateCharacter(
    id,
    updateCharacterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCharacterRequest** | **UpdateCharacterRequest**|  | |
| **id** | [**number**] | Character ID | defaults to undefined|


### Return type

**Character**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Character updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

