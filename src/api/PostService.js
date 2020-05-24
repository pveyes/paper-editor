import service from './Service';

class PostService {
  async getAll() {
    const response = await service.get('/post');

    return {
      posts: response.data.posts,
      error: response.error,
    };
  }

  async getById(postId) {
    const response = await service.get(`/post/${postId}`);

    return {
      post: response.data.post,
      error: response.error,
    };
  }

  async create(post) {
    const payload = {
      data: {
        post,
      },
    };

    const response = await service.post('/post', payload);
    return {
      post: response.data.post,
      error: response.error,
    };
  }

  async update(postId, post) {
    const payload = {
      data: {
        post,
      },
    };

    const response = await service.post(`/post/${postId}`, payload);
    return {
      post: response.data.post,
      error: response.error,
    };
  }

  async publish(postId, post, update) {
    const payload = {
      data: {
        post,
        publish: true,
        update,
      },
    };

    const response = await service.post(`/post/${postId}`, payload);
    return {
      post: response.data.post,
      error: response.error,
    };
  }

  async delete(postId) {
    const response = await service.delete(`/post/${postId}`);
    return {
      status: response.data.status,
      error: response.error,
    };
  }
}

export default new PostService();
