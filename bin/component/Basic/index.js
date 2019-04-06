import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import {
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Popconfirm,
  Menu,
  message,
  Badge,
  Divider,
} from 'antd';
import CustomerListTable from './CustomerListTable';

// css
import styles from './index.less';

// 业务组件
import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';

// enum
import ENUMERATIONDATA from '@/common/EnumerationData';

const { Option } = Select;


@connect(({ basic, loading }) => ({
  basic,
  loading: loading.models.basic,
}))
class basic extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    updateFormValues: [],
    // 批量选择的数据
    selectedRows: [],
  };

  columns = [
    {
      title: formatMessage({ id: 'system.basic.listPage.columnUserName' }),
      dataIndex: 'username',
    },
    {
      title: formatMessage({ id: 'system.basic.listPage.columnName' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'system.basic.listPage.columnEmail' }),
      dataIndex: 'email',
    },
    {
      title: formatMessage({ id: 'common.list.action' }),
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: formatMessage({ id: 'system.basic.listPage.statusLock' }),
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              this.handleUpdateModalVisible(true, record);
            }}
          >
            <FormattedMessage id="common.list.edit" />
          </a>
          <Divider type="vertical" />
          <Divider type="vertical" />
          <Popconfirm
            title={formatMessage({ id: 'system.basic.listPage.deleteBasic' })}
            onConfirm={() => this.handleDelete(record.id)}
          >
            <a href="">
              <FormattedMessage id="common.list.delete" />
            </a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  // 父组件调用子组件方法设置
  onRef = ref => {
    this.child = ref;
  };

  // 查询菜单简单字段渲染
  renderSimpleFormFileds = [
    {
      label: formatMessage({ id: 'system.basic.listPage.columnUserName' }),
      fieldDecorator: 'qp-username-like',
      type: 1,
      renderContent: <Input placeholder={formatMessage({ id: 'common.list.inputPlaceholder' })} />,
    },
    {
      label: formatMessage({ id: 'system.basic.listPage.columnName' }),
      fieldDecorator: 'qp-name-like',
      type: 1,
      renderContent: <Input placeholder={formatMessage({ id: 'common.list.inputPlaceholder' })} />,
    },
  ];

  // 查询菜单复杂字段渲染
  renderAdvancedFormFileds = [
    ...this.renderSimpleFormFileds,
    {
      label: formatMessage({ id: 'system.basic.listPage.columnEmail' }),
      fieldDecorator: 'qp-email-like',
      type: 1,
      renderContent: <Input placeholder={formatMessage({ id: 'common.list.inputPlaceholder' })} />,
    },
    {
      label: formatMessage({ id: 'system.basic.listPage.columnStatus' }),
      fieldDecorator: 'qp-status-eq',
      type: 1,
      renderContent: (
        <Select
          placeholder={formatMessage({ id: 'common.list.seletPlaceholder' })}
          style={{ width: '100%' }}
        >
          <Option value="0">
            <FormattedMessage id="system.basic.listPage.statusLock" />
          </Option>
          <Option value="1">
            <FormattedMessage id="system.basic.listPage.statusNormal" />
          </Option>
        </Select>
      ),
    },
  ];

  // 批量操作菜单渲染
  batchoperation = () => {
    const { selectedRows } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">
          <FormattedMessage id="common.list.delete" />
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.tableListOperator}>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
          <FormattedMessage id="common.list.add" />
        </Button>
        {selectedRows.length > 0 && (
          <span>
            <Dropdown overlay={menu}>
              <Button>
                <FormattedMessage id="common.list.batchOperation" /> <Icon type="down" />
              </Button>
            </Dropdown>
          </span>
        )}
      </div>
    );
  };

  // 表格选中record的callback函数
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 批量操作菜单点击
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'basic/remove',
          payload: selectedRows.map(row => row.id).join(','),
          actionName: {
            actionName: 'user',
          },
          successCallback: () => {
            message.success(formatMessage({ id: 'common.list.batchDeleteBasic' }));
            this.setState({
              selectedRows: [],
            });
            this.child.getData();
          },
          failCallBack: err => {
            message.error(err.msg);
          },
        });
        break;
      default:
        break;
    }
  };

  // 删除单个数据
  handleDelete = recordId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'basic/remove',
      payload: [recordId],
      actionName: {
        actionName: 'user',
      },
      successCallback: () => {
        message.success(formatMessage({ id: 'common.list.deleteBasicSuccess' }));
        this.setState({
          selectedRows: [],
        });
        this.child.getData();
      },
      failCallBack: err => {
        message.error(err.msg);
      },
    });
  };

  // 锁定/解锁用户
  handleLock = (recordId, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'basic/updateStatus',
      payload: {
        id: recordId,
        status,
      },
      actionName: {
        actionName: 'user',
      },
      successCallback: () => {
        message.success(
          status
            ? formatMessage({ id: 'system.basic.listPage.lockBasicSuccess' })
            : formatMessage({ id: 'system.basic.listPage.unLockBasicSuccess' })
        );
        this.child.getData();
      },
      failCallBack: err => {
        message.error(err.msg);
      },
    });
  };

  // 新增页面弹出
  handleModalVisible = flag => {
    this.setState({
      createModalVisible: !!flag,
    });
  };

  // 添加页面保存按钮的回调函数
  handleAdd = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: 'basic/add',
      payload: fields,
      actionName: {
        actionName: 'user',
      },
      successCallback: () => {
        message.success(formatMessage({ id: 'system.basic.listPage.createkBasicSuccess' }));
        this.handleModalVisible();
        this.child.getData();
      },
      failCallBack: err => {
        message.error(err.msg);
      },
    });
  };

  // 更新页面弹出
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  // 更新页面保存按钮的回调函数
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'basic/update',
      payload: fields,
      actionName: {
        actionName: 'user',
      },
      successCallback: () => {
        this.child.getData();
        message.success(formatMessage({ id: 'system.basic.listPage.updateBasicSuccess' }));
        this.handleUpdateModalVisible();
      },
      failCallBack: err => {
        message.error(err.msg);
      },
    });
  };

  // 渲染函数
  render() {
    const {
      createModalVisible,
      updateModalVisible,

      updateFormValues,
      selectedRows,
    } = this.state;

    // 传入新增组件方法
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    // 传入更新组件方法
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    return (
      <div>
        {createModalVisible && (
          <CreateForm {...parentMethods} createModalVisible={createModalVisible} />
        )}
        {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={updateFormValues}
          />
        ) : null}

        <CustomerListTable
          onRef={this.onRef}
          columns={this.columns}
          title={formatMessage({ id: 'system.basic.listPage.title' })}
          renderSimpleFormFileds={this.renderSimpleFormFileds}
          renderAdvancedFormFileds={this.renderAdvancedFormFileds}
          selectedRows={selectedRows}
          handleSelectRows={this.handleSelectRows}
          batchoperation={this.batchoperation}
        />
      </div>
    );
  }
}

export default basic;
