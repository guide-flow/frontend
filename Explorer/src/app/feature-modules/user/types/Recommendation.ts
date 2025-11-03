import { Follower } from "./Follower";

export interface Recommendation {
    mutualCount: number;
    userDto: Follower
}