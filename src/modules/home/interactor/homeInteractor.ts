import homeService from '../service/homeService';

class HomeInteractor {
  async getHomeData(): Promise<any[]> {
    return await homeService.getHomeData();
  }
}

export default new HomeInteractor();