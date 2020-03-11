import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Card, Input, Button, Divider, message, Switch, Popconfirm } from 'antd';
import { handleError, momentTime } from '@/utils/utils';

// css & img
import styles from '@/assets/common.less';

// 公共组件 & 方法
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ShowTable from '@/components/ShowTable';

// 业务组件
import CreateBasic from './components/Create';
import UpdateBasic from './components/Update';

// service & 枚举数据
import { disableItem, ableItem } from './service';

@connect(({ loading, basicComponents, global }) => ({
  global,
  basicComponents,
  loading: loading.models.basicComponents,
}))
class basicComponents extends PureComponent {
  state = {
    selectedRows: [],
    createBasicVisible: false,
    updateBasicVisible: false,
    selectItemValues: null,
  };

  columns = [
    {
      title: '基础名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属省',
      dataIndex: 'province',
      key: 'province',
    },
    {
      title: '所属市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '所属市/区/县',
      dataIndex: 'areaName',
      key: 'areaName',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 300,
      render: value => value && momentTime(value),
    },
    // 0启用 1禁用  原表格展示
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="停用"
          onClick={checked => this.updateState(checked, record.id)}
          checked={!!text}
        />
      ),
    },
    {
      title: formatMessage({ id: 'public.list.action' }),
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              this.handleUpdateBasicModalVisible(true, record);
            }}
          >
            <FormattedMessage id="public.list.edit" />
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除当前数据吗?"
            onConfirm={this.deleteSelectRow(record)}
            okText="确认"
            cancelText="取消"
          >
            <a href="#">
              <FormattedMessage id="public.list.delete" />
            </a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  /* -------------------------------------------- 生命周期函数 -------------------------------------------- */

  componentDidMount() {
    this.loadListData();
  }

  /* -------------------------------------------- 数据处理方法 -------------------------------------------- */

  // 加载列表数据
  loadListData = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'basicComponents/fetchModelList',
      payload: {
        'qp-storeId-eq': localStorage.getItem('storeId'),
      },
    });
  };

  /* -------------------------------------------- Popover内容相关代码 ------------------------------------- */

  // 添加基础弹出切换
  handleCreateBasicModalVisible = flag => {
    this.setState({
      createBasicVisible: !!flag,
    });
  };

  // 添加基础弹出框回调函数
  handleCreateBasicCallback = parms => {
    const { dispatch } = this.props;

    dispatch({
      type: 'basicComponents/addModel',
      payload: parms,
      callback: () => {
        message.success('新建基础成功！');
        this.handleCreateBasicModalVisible(false);
        this.loadListData();
      },
    });
  };

  // 编辑基础弹出切换
  handleUpdateBasicModalVisible = (flag, record) => {
    this.setState({
      updateBasicVisible: !!flag,
      selectItemValues: record,
    });
  };

  // 编辑基础弹出框回调函数
  handleUpdateBasicCallback = parms => {
    const { dispatch } = this.props;

    dispatch({
      type: 'basicComponents/updateModel',
      payload: parms,
      callback: () => {
        message.success('编辑基础成功！');
        this.handleUpdateBasicModalVisible(false);
        this.loadListData();
      },
    });
  };

  /* -------------------------------------------- 页面操作方法 -------------------------------------------- */

  // ShowTable组件选中多条数据的回调处理函数
  handleSelectRows = (rows, rowsKey) => {
    this.setState({
      selectedRows: rowsKey,
    });
  };

  // 停用启用基础
  updateState = (isChecked, recordId) => {
    if (isChecked) {
      ableItem(recordId).then(response => {
        if (handleError(response)) {
          message.success('启用基础成功！');
          this.loadListData();
          this.setState({ selectedRows: [] });
        } else {
          message.error(response.msg || response);
        }
      });
    } else {
      disableItem(recordId).then(response => {
        if (handleError(response)) {
          message.success('停用基础成功！');
          this.loadListData();
          this.setState({ selectedRows: [] });
        } else {
          message.error(response.msg || response);
        }
      });
    }
  };

  // 删除数据
  deleteSelectRow = record => {};

  /* -------------------------------------------- 纯函数组件 ---------------------------------------------- */

  // 查询菜单简单字段渲染
  renderSimpleFormFileds = () => [
    {
      label: '基础名称',
      fieldDecorator: 'qp-name-like',
      type: 1,
      renderContent: <Input autoComplete="off" allowClear placeholder="请输入基础名称" />,
    },
  ];

  renderHeaderActionButton = () => (
    <span>
      <Button icon="plus" type="primary" onClick={this.handleCreateBasicModalVisible}>
        <FormattedMessage id="public.set.addItem" />
      </Button>
    </span>
  );

  // menu = () => (
  //   <Menu selectedKeys={[]}>
  //     <Menu.MenuItem key="enabled">删除</Menu.MenuItem>
  //   </Menu>
  // );

  /* -------------------------------------------- 渲染函数 ------------------------------------------------  */

  render() {
    const {
      dispatch,
      loading,
      basicComponents: { data },
    } = this.props;

    const { selectedRows, createBasicVisible, updateBasicVisible, selectItemValues } = this.state;

    // 传入添加基础方法
    const CreateBasicMethods = {
      callbackFunction: this.handleCreateBasicCallback,
      handleModalVisible: this.handleCreateBasicModalVisible,
    };

    // 传入添加基础方法
    const UpdateBasicMethods = {
      callbackFunction: this.handleUpdateBasicCallback,
      handleModalVisible: this.handleUpdateBasicModalVisible,
    };

    return (
      <Fragment>
        <PageHeaderWrapper title="基础">
          <Card bordered={false}>
            <div className={styles.header}>
              <div>基础</div>
            </div>
            <Divider style={{ marginBottom: '30px' }} />
            <ShowTable
              loading={loading}
              dispatch={dispatch}
              featTableUrl="basicComponents/fetchModelList"
              data={data}
              columns={this.columns}
              rowKey="id"
              renderSimpleFormFileds={this.renderSimpleFormFileds()}
              renderHeaderActionButton={this.renderHeaderActionButton}
              menu={this.menu}
              selectedRows={selectedRows}
              handleSelectRows={this.handleSelectRows}
              parentParams={{
                'qp-storeId-eq': localStorage.getItem('storeId'),
              }}
            />
          </Card>
        </PageHeaderWrapper>

        {/* 弹出框内容 */}
        <CreateBasic {...CreateBasicMethods} modalVisible={createBasicVisible} />
        {selectItemValues && (
          <UpdateBasic
            {...UpdateBasicMethods}
            modalVisible={updateBasicVisible}
            values={selectItemValues}
          />
        )}
      </Fragment>
    );
  }
}

export default basicComponents;
