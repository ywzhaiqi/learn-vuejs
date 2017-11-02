<template>
<!-- 来源：https://codepen.io/tjFogarty/pen/pRjxGP -->
<!-- 可参考：http://www.zhangxinxu.com/wordpress/2017/01/html5-speech-recognition-synthesis-api/ -->
  <div>

      <div class="quiz-container">

        <form @submit.prevent="greet">

          <pulse-loader v-if="playState == STATE.playing"></pulse-loader>

          <div v-else>
            <h1>Speech Example</h1>

            <div class="form-group" v-if="voiceList.length">
              <label for="voices">Select a voice</label>
              <select class="form-control" id="voices" v-model="selectedVoice">
                <option v-for="(voice, index) in voiceList" :data-lang="voice.lang" :value="index" :key="index">
                  {{ voice.name }} ({{ voice.lang }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="your-name">Text</label>
              <textarea class="form-control" id="your-name" v-model="text" required />
            </div>
          </div>

          <button type="submit" class="btn btn-success" v-if="playState == STATE.stoping">开始朗读</button>
          <!-- <button type="submit" class="btn btn-success" v-if="playState == STATE.pausing">继续朗读</button> -->
          <!-- <button @click="pause" v-if="playState == STATE.playing" >暂停朗读</button> -->
          <button @click="stop" v-if="playState == STATE.playing">停止朗读</button>

        </form>

      </div>


  </div>
</template>

<script>
import PulseLoader from '../components/spinner/PulseLoader.vue'

const STATE = {
  playing: 1,
  pausing: 2,
  stoping: 0
}

export default {
  name: 'speech',
  data () {
    return {
      STATE,
      playState: STATE.stoping,
      text: '',
      selectedVoice: 0,
      synth: window.speechSynthesis,
      voiceList: [],
      speech: new window.SpeechSynthesisUtterance()
    }
  },
  components: {
    PulseLoader
  },
  mounted () {
    // wait for voices to load
    // I can't get FF to work without calling this first
    // Chrome works on the onvoiceschanged function
    this.voiceList = this.synth.getVoices()
    // if (this.voiceList.length) {
    //   this.isLoading = false
    // }
    this.synth.onvoiceschanged = () => {
      this.voiceList = this.synth.getVoices()
      // give a bit of delay to show loading screen
      // just for the sake of it, I suppose. Not the best reason
      // setTimeout(() => {
      //   this.isLoading = false
      // }, 800)
    }
    this.listenForSpeechEvents()
  },
  beforeDestory() {
    this.stop()
  },
  methods: {
    /**
     * React to speech events
     */
    listenForSpeechEvents () {
      this.speech.onstart = () => {
        this.playState = STATE.playing
      }
      this.speech.onend = () => {
        this.playState = STATE.stoping
      }
    },
    /**
     * Shout at the user
     */
    greet () {
      if (this.playState == STATE.pausing) {
        this.resume()
        return
      }

      // it should be 'craic', but it doesn't sound right
      this.speech.text = this.text
      this.speech.voice = this.voiceList[this.selectedVoice]
      this.synth.speak(this.speech)
    },
    pause() {  // pause 有 bug，好像会让 speechSynthesis 无效
      this.synth.pause()
      this.playState = STATE.pausing
      console.log('pause', this.playState, this.synth.paused)
    },
    resume() {
      this.synth.resume()
      this.playState = STATE.playing
    },
    stop() {
      this.synth.cancel()
    }
  }
}
</script>

<style scoped>
  .quiz-container {
    min-width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  form {
    padding: 30px;
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 10px 30px 10px rgba(0, 0, 0, 0.1);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity ease .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .btn-success {
    background: #43C6AC;
    border-color: #43C6AC;
    cursor: pointer;
  }
  h1 {
    margin-bottom: 25px;
  }
</style>