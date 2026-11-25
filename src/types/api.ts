export type ErrorCode =
  | 'DUPLICATE USERNAME'
  | 'BAD_PICTURE_DATA'
  | 'LOGGED_IN'
  | 'INCORRECT CREDENTIALS'
  | 'INVALID DATA'
  | 'NO SUCH ENTITY'
  | 'NOT YOURS'
  | 'NOT_AUTHENTICATED'
  | 'INTERNAL ERROR'

export interface ZodIssue {
  code: string
  message: string
  path: (string | number)[]
}

export interface APIErrorCommon {
  failed: true
  code: ErrorCode
  extra?: ZodIssue[] | unknown
}

export interface LoginReq {
  username: string
  password: string
}

export interface LoginRes {
  failed: false
  token: string
  user_id: string
  username: string
}

export interface UserCreationReq {
  username: string
  password: string
}

export interface UserCreationRes {
  failed: false
  user_id: string
}

export interface BasePictureDto {
  name: string
  picture_data: string[][]
}

export interface PictureAuthor {
  user_id: string
  username: string
}

export interface PictureDto extends BasePictureDto {
  picture_id: string
  author: PictureAuthor
  created_at: string
  updated_at: string
}

export type NewPictureReq = BasePictureDto

export interface NewPictureRes {
  failed: false
  picture_id: string
}

export interface PictureListingPage {
  pictures: PictureDto[]
  total: number
}

export interface GetPictureRes {
  failed: false
  picture: PictureDto
}

export interface UpdatePictureRes {
  failed: false
}

export interface DeletePictureRes {
  failed: false
}
