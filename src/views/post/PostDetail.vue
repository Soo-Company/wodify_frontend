<template>
  <v-container class="container">
    <v-card v-if="post" class="post-card">
      <v-card-title>
        <v-row align="center" justify="space-between" class="mb-1">
          <v-col>
            <v-row align="center" class="ml-1 mt-1">
              <v-icon v-if="post.type === 'NOTICE'" class="announcement-icon mr-2"
                >mdi-bell-ring-outline</v-icon
              >
              <v-icon v-else class="post-icon mr-2">mdi-note-outline</v-icon>
              <h2>{{ post.title }}</h2>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-row>
              <v-btn class="custom-btn" @click="likePost">
                <v-icon>mdi-thumb-up</v-icon> {{ post.likeCount }}
              </v-btn>
              <v-btn class="custom-btn" @click="goBackToList">
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-btn>
              <v-btn class="custom-btn" v-if="isAuthor" @click="goToEditPost">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="custom-btn"
                v-if="isAuthor"
                @click="showDeleteConfirmationModal"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col>
            <p><strong>Created On:</strong> {{ post.createdTime }}</p>
            <p><strong>글쓴이:</strong> {{ post.name }}</p>
          </v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <div v-html="post.contents"></div>
      </v-card-text>
    </v-card>

    <v-card v-if="post" class="comment-section">
      <v-card-title>댓글</v-card-title>
      <v-card-text>
        <v-row class="comment-box" align="center">
          <v-col>
            <v-text-field
              v-model="newComment"
              label="Write a comment..."
              style="margin-top: -10px; margin-bottom: -10"
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn icon class="custom-btn" @click="submitComment">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-1"></v-divider>
        <v-list>
          <comment-item
            v-for="comment in post.comments"
            :key="comment.id"
            :comment="comment"
            :postId="post.id"
            :currentUserId="this.currentUserId"
            @comment-deleted="removeComment"
          ></comment-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- 삭제 확인 모달 -->
    <v-dialog v-model="showDeleteModal" persistent max-width="400px">
      <v-card>
        <v-card-text>정말로 삭제하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="confirmDelete">확인</v-btn>
          <v-btn color="grey" text @click="closeDeleteModal">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 결과 모달 -->
    <v-dialog v-model="showResultModal" persistent max-width="400px">
      <v-card>
        <v-card-text>{{ resultMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="handleResultConfirmation">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 내용 입력 요청 모달 -->
    <v-dialog v-model="showEmptyCommentModal" persistent max-width="400px">
      <v-card>
        <v-card-text>내용을 입력해주세요.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="closeEmptyCommentModal">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import CommentItem from "./CommentItem.vue";

export default {
  props: ["id"],
  data() {
    return {
      post: null,
      newComment: "",
      currentUserId: null,
      isAuthor: false,
      showDeleteModal: false, // 삭제 확인 모달 제어 변수
      showEmptyCommentModal: false, // 빈 댓글 알림 모달 제어 변수
      showResultModal: false, // 결과 모달 제어 변수
      resultMessage: "", // 결과 메시지
    };
  },
  created() {
    this.getCurrentUserId();
    this.fetchPostDetail();
  },
  methods: {
    goBackToList() {
      this.$router.push("/post/list");
    },
    goToEditPost() {
      this.$router.push(`/post/update/${this.id}`);
    },
    getCurrentUserId() {
      this.currentUserId = localStorage.getItem("memberId");
    },
    checkAuthor() {
      if (this.post) this.isAuthor = this.post.memberId === Number(this.currentUserId);
    },
    showDeleteConfirmationModal() {
      this.showDeleteModal = true;
    }, // 삭제 확인 모달 열기
    closeDeleteModal() {
      this.showDeleteModal = false;
    }, // 삭제 확인 모달 닫기
    async fetchPostDetail() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/post/detail/${this.id}`
        );
        this.post = response.data.result;
        this.checkAuthor();
      } catch (error) {
        console.error("Error fetching post detail:", error);
      }
    },
    confirmDelete() {
      this.showDeleteModal = false;
      this.deletePost();
    },
    async deletePost() {
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_API_BASE_URL}/post/delete/${this.id}`
        );
        if (response.status === 200) {
          this.resultMessage = response.data.status_message;
          this.goBackToList();
        } else {
          this.resultMessage = response.data.error_message;
          this.showResultModal = true; // 결과 모달 열기
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        this.resultMessage = "게시물 삭제 중 오류가 발생했습니다.";
        this.showResultModal = true; // 결과 모달 열기
      }
    },
    async likePost() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/post/like/${this.id}`
        );
        if (response.status === 200) {
          this.post.likeCount = response.data.result;
        } else {
          this.resultMessage = "좋아요에 실패했습니다.";
          this.showResultModal = true; // 결과 모달 열기
        }
      } catch (error) {
        console.error("Error liking post:", error);
        this.resultMessage = "좋아요 처리 중 오류가 발생했습니다.";
        this.showResultModal = true; // 결과 모달 열기
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) {
        this.showEmptyCommentModal = true; // 모달 표시
        return;
      }
      const commentData = { comment: this.newComment, parentId: null };
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/post/comment/create/${this.id}`,
          commentData
        );
        if (response.status === 201) {
          this.post.comments.push(response.data.result);
          this.newComment = "";
        } else {
          this.resultMessage = "댓글 등록에 실패했습니다.";
          this.showResultModal = true; // 결과 모달 열기
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
        this.resultMessage = "댓글 등록 중 오류가 발생했습니다.";
        this.showResultModal = true; // 결과 모달 열기
      }
    },
    removeComment(commentId) {
      this.post.comments = this.post.comments.filter(
        (comment) => comment.id !== commentId
      );
    },
    closeEmptyCommentModal() {
      this.showEmptyCommentModal = false; // 모달 닫기
    },
    closeDeleteConfirmationModal() {
      this.showDeleteConfirmationModal = false; // 삭제 확인 모달 닫기
    },
    handleResultConfirmation() {
      this.showResultModal = false; // 결과 모달 닫기
    },
  },
  components: { CommentItem },
};
</script>

<style scoped>
.container {
  padding: 24px;
  max-width: 1216px;
  margin: auto;
  margin-top: -8px;
  border-radius: 8px;
}

.post-card,
.comment-section {
  padding: 10px;
  margin-bottom: 12px;
}

.announcement-icon {
  color: #f39c12;
  font-size: 24px;
}

.custom-btn {
  background-color: black !important;
  color: white !important;
  margin-left: 4px;
  font-weight: 600;
}

.comment-box {
  margin-top: 0px;
}

.comment-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
