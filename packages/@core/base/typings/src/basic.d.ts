interface BasicOption {
  label: string;
  value: string;
}

interface BasicUserRole {
  role?: string;
  roleName?: string;
  value?: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: Array<BasicUserRole | string>;
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

type ClassType =
  | Array<ClassType>
  | boolean
  | null
  | object
  | string
  | undefined;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
