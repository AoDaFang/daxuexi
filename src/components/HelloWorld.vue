<template>
  <div :class="['mian-wrapper']">
    <img
      class="cover-img"
      v-if="showState === 0"
      id="cover-img"
      @click="playVideo"
      src="../assets/imgs/cover.jpg"
      alt
    />
    <!-- 视频 -->
    <video
      :class="[{'hide': showState !== 1}, {'blur': isShowBlur}]"
      id="mian-video"
      width="100%"
      :src="videoList[videoIndex].src"
    ></video>
    <!-- 问题列表 -->
    <div :class="['question-wrapper', {'blur': isShowBlur}]" v-if="showState === 2">
      <div class="question-title">{{questionList[questionIndex].title}}</div>
      <div class="option-wrapper">
        <div
          @click="dealClickOption"
          v-for="(item, index) in questionList[questionIndex].options"
          :key="index"
          :class="['question-option', 
          questionList[questionIndex].activationState[index] ? 'active' : ''
          ]"
          :data-opetionIndex="index"
        >
        {{item}}
        <img src="../assets/imgs/right.png" alt="" v-if="questionList[questionIndex].sign[index] === 1">
        <img src="../assets/imgs/wrong.png" alt="" v-if="questionList[questionIndex].sign[index] === 2">
        </div>
      </div>
      <div class="sure-btn" @click="subAnswer"><img src="../assets/imgs/button1.png" alt=""></div>
      <div class="gif-wrapper"><img src="../assets/imgs/tuanbao.gif" alt=""></div>
    </div>
    <div v-if="showState === 4">恭喜完成武城七一大学习</div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {},
  data() {
    return {
      showState: 0, // 当前播放状态
      isShowBlur: false, // 是否显示虚化
      videoList: [
        { src: require("../assets/videos/1.mp4") },
        { src: require("../assets/videos/2.mp4") }
      ], // 视频列表
      videoIndex: 0, // 播放到第几个视频
      questionIndex: 0, // 显示第几个问题
      questionList: [
        {
          title: "问题1",
          options: ["问题1选项1", "问题1选项2", "问题1选项3"],
          multiple: true, // 是否多选
          activationState:[0, 0, 0], // 选中情况
          rightKey: [1, 0, 1], // 正确答案
          sign: [0, 0, 0] // 显示对号错号 0不显示 1对号 2错号 
        },
        {
          title: "问题2",
          options: ["问题2选项1", "问题1选项2", "问题2选项3"],
          multiple: false, // 是否多选
          activationState:[0, 0, 0, 0], // 选中情况
          rightKey: [0, 0, 1, 0], // 正确答案
          sign: [0, 0, 0] // 显示对号错号 0不显示 1对号 2错号 
        }
      ]
    };
  },
  mounted() {
    const videoPlayer = document.getElementById("mian-video");
    // 检测视频播放暂停
    videoPlayer.addEventListener(
      "ended",
      () => {
        setTimeout(() => {
          this.showState = 2; //切换播放状态到显示题目
          this.isShowBlur = false;
        }, 600);
        this.isShowBlur = true; // 显示模糊
        this.videoIndex < this.videoList.length - 1 && this.videoIndex++; //视频index加一
      },
      false
    );
  },
  methods: {
    // 播放视频
    playVideo() {
      this.showState = 1; // 隐藏封面 显示视频
      const videoPlayer = document.getElementById("mian-video");
      videoPlayer.play(); // 播放视频
    },
    // 提交答案
    subAnswer() {
      console.log('提交答案');
      let noAnswerSign = true;
      for(let i = 0; i<this.questionList[this.questionIndex].activationState.length; i++){
        if(this.questionList[this.questionIndex].activationState[i] === 1){
          noAnswerSign = false;
          break;
        }
      }
      if(noAnswerSign) return; // 没有答案不操作
      /**
       * 判定对错、显示对错号逻辑
       */
      if(this.questionList[this.questionIndex].activationState.toString() === this.questionList[this.questionIndex].rightKey.toString()){
        console.log('回答正确');
        // 显示对号
        this.questionList[this.questionIndex].sign = this.questionList[this.questionIndex].rightKey;
      } else {
        console.log('回答错误');
        // 显示对号和错号
        for(var i = 0; i<this.questionList[this.questionIndex].rightKey.length; i++){
          // 此项应该选中 显示对号
          if(this.questionList[this.questionIndex].rightKey[i] === 1){
            this.$set(this.questionList[this.questionIndex].sign, i, 1);
          } else {
            // 此项不应该选 但是选了 直接显示错号
            if(this.questionList[this.questionIndex].activationState[i] === 1){
              this.$set(this.questionList[this.questionIndex].sign, i, 2);
            }
          }
        }
      }


      setTimeout(() => {
        this.isShowBlur = true;
        if (this.questionIndex < this.questionList.length - 1) {
          this.questionIndex++;
          setTimeout(()=>{
            this.showState = 1;
            this.isShowBlur = false;
          }, 500);
          this.playVideo();
        } else {
          console.log("结束画面");
          setTimeout(()=>{
            this.showState = 4;
            this.isShowBlur = false;
          }, 500);
        }
      }, 2000);
    },
    // 点击选项
    dealClickOption(e){
      const opetionindex = e.target.dataset.opetionindex;
      const questionIndex = this.questionIndex;
      if(this.questionList[questionIndex].multiple){ // 多选
        console.log("多选");
        // 将每一项置为反状态
        this.questionList[questionIndex].activationState[opetionindex] ? 
        this.$set(this.questionList[questionIndex].activationState,opetionindex,0) :
        this.$set(this.questionList[questionIndex].activationState,opetionindex,1);
      } else {// 单选
        console.log("单选");
        // 将每一项置0
        for(var i = 0; i< this.questionList[questionIndex].activationState.length; i++){
          this.$set(this.questionList[questionIndex].activationState, i, 0)
        }
        this.$set(this.questionList[questionIndex].activationState,opetionindex,1);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mian-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s;
}
.question-wrapper{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  background-size: 100% 100%;
  background-image: url("../assets/imgs/p1.png");
  display: flex;
  justify-content: center;
}
.question-title{
  position: absolute;
  width: 62%;
  height: 8.1%;
  left: 18.23%;
  top: 20.46%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fdf8e7;
  font-size: 26px;
  font-weight: bold;
}
.option-wrapper{
  position: absolute;
  width: 67%;
  height: 46%;
  left: 16.23%;
  top: 34.97%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.question-option{
  background-image:  url("../assets/imgs/lowLight.png");
  width: 100%;
  height: 14%;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 5px 5px 5px #666;
  color: #983426;
  font-size: 18px;
}
.question-option.active{
  background-image:  url("../assets/imgs/highLight.png");
}
.question-option img{
  position: absolute;
  right: 0;
  width: 15%;
}
.sure-btn{
    width: 38%;
    position: absolute;
    top: 84%;
}
.sure-btn img{
  width: 100%;
}
.gif-wrapper{
  width: 38%;
  position: absolute;
  top: 84%;
  right:  1%;
}
.gif-wrapper img{
  width: 100%;
}
video {
  transition: all 0.4s;
}
.blur {
  filter: blur(20px);
}

.play-btn {
  position: absolute;
}

.hide {
  display: none;
}

.cover-img {
  width: 100%;
}
</style>
