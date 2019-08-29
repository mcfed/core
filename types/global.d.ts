interface AttributeOpts {
  getDefault?: () => Function;
  fieldName?: string;
  get?: () => Function;
  set?: () => Function;
}
