<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	onLaunch: function() {
		this.init();
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	computed: {
		...mapState(['nodeList']),
		...mapGetters(['getNode', 'getCurrentSelected', 'getNodeList'])
	},

	methods: {
		...mapMutations(['setNode', 'setSelectArray', 'setNodeList']),
		init() {
			// uni.clearStorageSync();
			this.initNode();
		},
		initNode() {
			if (!this.getNodeList) {
				this.$u.get('/getClassifyList').then(req => {
					let nodeList = req.data;

					this.setNodeList(nodeList);

					this.setNode(nodeList[0].node);

					if (!this.getCurrentSelected) {
						let _list = [];
						nodeList.forEach(item => {
							let { defaultSelected, node } = item;
							if (defaultSelected.length !== 0) {
								let _selected = {
									name: node,
									list: []
								};
								for (var i = 0; i < 3; i++) {
									_selected.list.push(defaultSelected);
								}
								_list.push(_selected);
							}
						});
						this.setSelectArray(_list);
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-ui/index.scss';
</style>
