export const columns = [
  {
    title: '业务时间',
    dataIndex: 'settleTime',
  },
  {
    title: '运单号',
    dataIndex: 'waybillNo',
  },
  {
    title: '所属网点',
    dataIndex: 'siteName',
  },
  {
    title: '结算类型',
    dataIndex: 'settleType',
  },
  {
    title: '结算对象',
    dataIndex: 'settleObjectName',
  },
  {
    title: '数据处理提示',
    dataIndex: 'amountErrorDesc',
  },
  {
    title: '中转费/运费',
    dataIndex: 'settleAmount',
  },
].map((c) => {
  c.width = 175;
  return c;
});
